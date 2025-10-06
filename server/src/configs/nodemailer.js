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
exports.sendResultExam = exports.transport = void 0;
exports.sendMailChangePW = sendMailChangePW;
exports.sendMailVerifyEmail = sendMailVerifyEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const const_1 = require("./const");
const mail_change_pw_temp_1 = require("../utils/mail_temp/mail.change-pw.temp");
const mail_verify_temp_1 = require("../utils/mail_temp/mail.verify.temp");
const mail_result_exam_temp_1 = require("../utils/mail_temp/mail.result-exam.temp");
exports.transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: const_1.constEnv.nodemailerUser,
        pass: const_1.constEnv.nodemailerPass,
    },
});
// async..await is not allowed in global scope, must use a wrapper
function sendMailChangePW(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield exports.transport.sendMail({
                from: "hauhpll1231@gmail.com", // sender address
                to: data.to, // list of receivers
                subject: "Toeic Journey - Change your password", // Subject line
                html: (0, mail_change_pw_temp_1.changePwMailTemp)(data.otp, data.to), // html body
            });
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        catch (error) {
            console.log(error);
        }
        // send mail with defined transport object
    });
}
function sendMailVerifyEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield exports.transport.sendMail({
                from: "hauhpll1231@gmail.com", // sender address
                to: data.to, // list of receivers
                subject: "Toeic Journey - Verify your email", // Subject line
                html: (0, mail_verify_temp_1.verifyMailTemp)(data.otp, data.to), // html body
            });
            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }
        catch (error) {
            console.log(error);
        }
        // send mail with defined transport object
    });
}
const sendResultExam = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, data, }) {
    const mailOptions = {
        from: const_1.constEnv.nodemailerUser,
        to,
        subject: "Kết quả bài thi TOEIC",
        html: (0, mail_result_exam_temp_1.resultExamTemplate)(data),
    };
    try {
        yield exports.transport.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
});
exports.sendResultExam = sendResultExam;
