"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class WebCrawler {
    constructor(maxDepth = 2, maxPages = 10) {
        this.visitedUrls = new Set();
        this.extractedData = [];
        this.maxDepth = maxDepth;
        this.maxPages = maxPages;
    }
    crawl(startUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Crawling started: ", startUrl);
            yield this.crawlRecursive(startUrl);
            this.saveToFile();
            return this.extractedData;
        });
    }
    crawlRecursive(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, currentDepth = 0) {
            if (currentDepth > this.maxDepth ||
                this.visitedUrls.size >= this.maxPages ||
                this.visitedUrls.has(url)) {
                return;
            }
            try {
                this.visitedUrls.add(url);
                // Mở trình duyệt Puppeteer và lấy dữ liệu
                const browser = yield puppeteer_1.default.launch();
                const page = yield browser.newPage();
                yield page.goto(url, { waitUntil: "networkidle2" });
                // Trích xuất dữ liệu từ trang
                const data = yield page.evaluate(() => {
                    const articles = [];
                    const elements = document.querySelectorAll("article, .content, .post");
                    elements.forEach((elem) => {
                        var _a;
                        const title = (((_a = elem.querySelector("h1, h2")) === null || _a === void 0 ? void 0 : _a.textContent) || "").trim();
                        const content = Array.from(elem.querySelectorAll("p"))
                            .map((p) => { var _a; return (_a = p.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
                            .filter(Boolean)
                            .join("\n");
                        if (title || content) {
                            articles.push({
                                url: window.location.href, // Đặt URL trang hiện tại
                                title,
                                content,
                                timestamp: new Date().toISOString(),
                            });
                        }
                    });
                    return articles;
                });
                this.extractedData.push(...data);
                yield browser.close();
                // Trích xuất các liên kết để tiếp tục crawl
                const links = yield page.$$eval("a", (anchorElements) => anchorElements
                    .map((el) => el.getAttribute("href"))
                    .filter((link) => link && !link.startsWith("#") && !link.startsWith("javascript:")));
                for (const link of links) {
                    const absoluteLink = this.normalizeUrl(link, url);
                    if (this.isValidLink(absoluteLink, url)) {
                        yield this.crawlRecursive(absoluteLink, currentDepth + 1);
                    }
                }
            }
            catch (error) {
                console.error(`Error crawling ${url}:`, error);
            }
        });
    }
    normalizeUrl(link, baseUrl) {
        try {
            return new URL(link, baseUrl).toString();
        }
        catch (_a) {
            return null;
        }
    }
    isValidLink(link, baseUrl) {
        if (!link)
            return false;
        try {
            const baseUrlObj = new URL(baseUrl);
            const linkUrlObj = new URL(link);
            return (linkUrlObj.protocol === baseUrlObj.protocol &&
                linkUrlObj.hostname === baseUrlObj.hostname &&
                !this.visitedUrls.has(link));
        }
        catch (_a) {
            return false;
        }
    }
    saveToFile() {
        const outputPath = path_1.default.join(__dirname, "crawled_data.json");
        fs_1.default.writeFileSync(outputPath, JSON.stringify(this.extractedData, null, 2));
        console.log(`Saved ${this.extractedData.length} documents to ${outputPath}`);
    }
}
exports.default = WebCrawler;
