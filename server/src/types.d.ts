declare global {
  namespace Express {
    interface User {
      id: string;
      // Add other properties as needed
    }
  }
  
  var io: any; // Socket.IO instance
}

export {};
