import React, { createContext, useContext, useState, useEffect } from 'react'
import { Endpoint } from '../api' // Import Endpoint class
import { ref, get, db } from '../lib/firebase'
const EndpointContext = createContext(null)

// Tạo một custom hook để sử dụng context
export const useEndpoint = () => {
  return useContext(EndpointContext)
}

export const EndpointProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState(null)
  useEffect(() => {
    get(ref(db, 'webclient/server')).then((snapshot) => {
      if (!snapshot.exists()) return
      const endpointInstance = new Endpoint(snapshot.val()) // Tạo instance một lần
      setEndpoint(endpointInstance) // Cập nhật instance vào state
    })
  }, [])
  if (!endpoint) {
    return <div>Loading...</div>
  }
  return <EndpointContext.Provider value={{ endpoint }}>{children}</EndpointContext.Provider>
}
