// const natural = require("natural");
// const _ = require("lodash");

// class TFIDFEmbedding {
//   constructor() {
//     this.vocabulary = new Set();
//     this.documents = [];
//     this.tfIdfVectors = [];
//   }

//   // Xử lý từ - loại bỏ ký tự đặc biệt, chuyển lowercase
//   preprocessText(text) {
//     return text
//       .toLowerCase()
//       .replace(/[^\w\s]/g, "")
//       .split(/\s+/)
//       .filter((word) => word.length > 1);
//   }

//   // Thêm tài liệu và cập nhật từ vựng
//   addDocument(text) {
//     const tokens = this.preprocessText(text);

//     // Cập nhật từ vựng
//     tokens.forEach((token) => this.vocabulary.add(token));

//     this.documents.push(tokens);
//   }

//   // Tính TF (Term Frequency)
//   calculateTF(document) {
//     const termFrequency = {};
//     document.forEach((term) => {
//       termFrequency[term] = (termFrequency[term] || 0) + 1;
//     });
//     return termFrequency;
//   }

//   // Tính IDF (Inverse Document Frequency)
//   calculateIDF() {
//     const idf = {};
//     const totalDocuments = this.documents.length;

//     this.vocabulary.forEach((term) => {
//       // Đếm số document chứa từ này
//       const documentsWithTerm = this.documents.filter((doc) =>
//         doc.includes(term)
//       ).length;

//       // Công thức IDF
//       idf[term] = Math.log(totalDocuments / (documentsWithTerm + 1)) + 1;
//     });

//     return idf;
//   }

//   // Tạo vector embedding
//   createEmbeddings() {
//     const idf = this.calculateIDF();

//     this.tfIdfVectors = this.documents.map((document) => {
//       const tf = this.calculateTF(document);

//       // Tạo vector embedding
//       const vector = Array.from(this.vocabulary).map((term) => {
//         return (tf[term] || 0) * (idf[term] || 0);
//       });

//       return vector;
//     });

//     return this.tfIdfVectors;
//   }

//   // Tính độ tương đồng cosine
//   cosineSimilarity(vector1, vector2) {
//     const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
//     const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
//     const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));

//     return dotProduct / (magnitude1 * magnitude2);
//   }

//   // Tìm các tài liệu tương đồng
//   findSimilarDocuments(queryText, threshold = 0.5) {
//     const queryTokens = this.preprocessText(queryText);

//     // Tạo vector cho query
//     const queryVector = Array.from(this.vocabulary).map((term) => {
//       const idf = this.calculateIDF()[term] || 0;
//       const tf = queryTokens.filter((t) => t === term).length;
//       return tf * idf;
//     });

//     // So sánh độ tương đồng
//     return this.tfIdfVectors
//       .map((docVector, index) => ({
//         similarity: this.cosineSimilarity(queryVector, docVector),
//         document: this.documents[index],
//       }))
//       .filter((result) => result.similarity > threshold)
//       .sort((a, b) => b.similarity - a.similarity);
//   }
// }

// // Ví dụ sử dụng
// function demo() {
//   const embedding = new TFIDFEmbedding();

//   // Thêm tài liệu
//   embedding.addDocument("Dịch vụ sửa xe máy chuyên nghiệp");
//   embedding.addDocument("Bảng giá dịch vụ sửa chữa xe năm 2024");
//   embedding.addDocument("Quy trình sửa chữa xe máy nhanh chóng");

//   // Tạo embedding
//   embedding.createEmbeddings();

//   // Tìm tài liệu tương đồng
//   const similarDocs = embedding.findSimilarDocuments("Giá sửa xe máy");
//   console.log(similarDocs);
// }

// demo();
