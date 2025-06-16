"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Endpoint } from "../../api"; // Import Endpoint class
import { ref, get, db } from "~lib/firebase";
import { Loader2 } from "lucide-react";
const EndpointContext = createContext(null);

// Tạo một custom hook để sử dụng context
export const useEndpoint = () => {
  return useContext(EndpointContext);
};

export const EndpointProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState(null);
  const env = process.env.NEXT_PUBLIC_ENV;
  useEffect(() => {
    console.log("env", env);
    if (env === "vercel") {
      get(ref(db, "ngrok/vercel")).then((snapshot) => {
        if (!snapshot.exists()) return;
        const endpointInstance = new Endpoint(snapshot.val()); // Tạo instance một lần
        setEndpoint(endpointInstance); // Cập nhật instance vào state
      });
      return;
    }
    get(ref(db, "webclient/server")).then((snapshot) => {
      if (!snapshot.exists()) return;
      const endpointInstance = new Endpoint(snapshot.val()); // Tạo instance một lần
      setEndpoint(endpointInstance); // Cập nhật instance vào state
    });
  }, []);
  if (!endpoint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-50 ">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-gray-600  mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700  mb-2">
            Đang tải...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }
  return (
    <EndpointContext.Provider value={{ endpoint }}>
      {children}
    </EndpointContext.Provider>
  );
};
