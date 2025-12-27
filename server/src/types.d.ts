declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      role?: string; // 'admin' | 'user'
      // Add other properties as needed
    }
  }
  
  var io: any; // Socket.IO instance
}

export {};
