// 'use client'

// import { useState } from 'react'
// import * as XLSX from 'xlsx'
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Upload } from "lucide-react"

// export function ExcelUploader() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [data, setData] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const handleFileUpload = async (event) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     setIsLoading(true)
//     setError(null)

//     try {
//       const arrayBuffer = await file.arrayBuffer()
//       const workbook = XLSX.read(arrayBuffer)
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]]
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
//       setData(jsonData)
//       setIsOpen(false)
//     } catch (err) {
//       setError('Error parsing Excel file. Please make sure it\'s a valid .xlsx file.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     (<div className="container mx-auto p-4">
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           <Button>
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Excel File
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upload Excel File</DialogTitle>
//           </DialogHeader>
//           <div className="mt-4">
//             <input
//               type="file"
//               accept=".xlsx, .xls"
//               onChange={handleFileUpload}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-full file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-violet-50 file:text-violet-700
//                 hover:file:bg-violet-100" />
//           </div>
//         </DialogContent>
//       </Dialog>
//       {isLoading && <p className="mt-4">Loading...</p>}
//       {error && <p className="mt-4 text-red-500">{error}</p>}
//       {data.length > 0 && (
//         <div className="mt-8 overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 {data[0].map((header, index) => (
//                   <TableHead key={index}>{header}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.slice(1).map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   {row.map((cell, cellIndex) => (
//                     <TableCell key={cellIndex}>{cell}</TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>)
//   );
// }