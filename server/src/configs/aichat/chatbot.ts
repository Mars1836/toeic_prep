// import { ChromaClient, Collection } from 'chromadb';
// import axios from 'axios';
// import { genAI } from './instance';

// // Placeholder for Gemini AI configuration
// export const modelAI = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",

// });

// type Embedding = number[]; // Kiểu cho vector embedding

// type RelevantDocument = {
//   id: string;
//   document: string;
//   metadata: { [key: string]: any };
// };

// class BusinessChatbot {
//   private chromaClient: ChromaClient;
//   private websiteUrl: string;
//   private vectorStore: Collection | null;

//   constructor(websiteUrl: string) {
//     this.chromaClient = new ChromaClient();
//     this.websiteUrl = websiteUrl;
//     this.vectorStore = null;
//   }

//   // Thu thập nội dung từ website
//   async crawlWebsiteContent(): Promise<string> {
//     try {
//       const response = await axios.get(this.websiteUrl);
//       return this.extractTextFromHTML(response.data);
//     } catch (error) {
//       console.error('Lỗi thu thập nội dung:', error);
//       throw error;
//     }
//   }

//   // Trích xuất văn bản từ HTML
//   private extractTextFromHTML(html: string): string {
//     // Xử lý HTML (ví dụ: loại bỏ thẻ và lấy text thuần túy)
//     return html.replace(/<[^>]*>/g, ' ').trim();
//   }

//   // Chuyển đổi nội dung thành vector
//   async embedContent(content: string): Promise<void> {
//     try {
//       const collection = await this.chromaClient.createCollection({ name: 'chatbot' });

//       await collection.add({
//         ids: ['content_1'],
//         embeddings: [this.generateEmbedding(content)],
//         metadatas: [{ source: 'website' }],
//         documents: [content]
//       });

//       this.vectorStore = collection;
//     } catch (error) {
//       console.error('Lỗi khi chuyển đổi nội dung thành vector:', error);
//       throw error;
//     }
//   }

//   // Tạo vector embedding (giả định sử dụng Gemini AI hoặc dịch vụ khác)
//   private generateEmbedding(content: string): Embedding {
//     // Placeholder cho quá trình tạo embedding thực sự
//     return Array(768).fill(0); // Ví dụ giả lập embedding với 768 chiều
//   }

//   // Truy xuất thông tin liên quan
//   async retrieveRelevantContext(query: string): Promise<RelevantDocument[]> {
//     if (!this.vectorStore) {
//       throw new Error('Vector store chưa được khởi tạo.');
//     }

//     const results = await this.vectorStore.query({
//       queryTexts: [query],
//       nResults: 3
//     });

//     return results.documents.map((doc: any, index: any) => ({
//       id: results.ids[index],
//       document: doc,
//       metadata: results.metadatas[index]
//     }));
//   }

//   // Tích hợp với Gemini AI
//   async generateResponse(userQuery: string): Promise<string> {
//     try {
//       const relevantContexts = await this.retrieveRelevantContext(userQuery);
//       const relevantText = relevantContexts.map(ctx => ctx.document).join('\n');

//       const response = await modelAI.generateContent(
//       `Sử dụng thông tin sau để trả lời chính xác:\n${relevantText}\n\nCâu hỏi: ${userQuery}`,
//       );

//       return response.response.text();
//     } catch (error) {
//       console.error('Lỗi khi tạo phản hồi:', error);
//       throw error;
//     }
//   }

//   // Hàm kiểm tra trạng thái vector store
//   isVectorStoreReady(): boolean {
//     return this.vectorStore !== null;
//   }

//   // Làm mới vector store
//   async refreshVectorStore(): Promise<void> {
//     try {
//       this.vectorStore = await this.chromaClient.getCollection({ name:                   });
//     } catch (error) {
//       console.error('Lỗi khi làm mới vector store:', error);
//       throw error;
//     }
//   }
// }

// export default BusinessChatbot;
