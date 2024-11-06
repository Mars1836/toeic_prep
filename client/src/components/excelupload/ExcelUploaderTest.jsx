"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Table as TableIcon } from "lucide-react";
import { toast } from "react-toastify";
export default function ExcelUploaderTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const header = ["a", "ab", "abc", "abcd"];
  const fillCols = [0, 1];
  const fileExcel =
    "https://storage.googleapis.com/simpl-project138_cloudbuild/file/excel/exam.1.mini-test1.xlsx";
  const checkHeader = () => {
    // Check if the lengths are the same
    if (header.length !== data[0].length) {
      setError("Tiêu đề các cột bị sai!");
      return false;
    }
    const check = header.every((item, index) => {
      return item === data[0][index].trim();
    });
    if (!check) {
      setError("Tiêu đề các cột bị sai!");
      return false;
    }

    return true;
  };
  function check() {
    if (checkHeader()) {
      checkValueTable();
    }
  }

  const handleFileUpload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(fileExcel);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });
      setData(jsonData);
    } catch (err) {
      setError(
        "Error parsing Excel file. Please make sure it's a valid .xlsx file."
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);
  useEffect(() => {
    handleFileUpload();
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <TableIcon className="mr-2 h-4 w-4" />
          Check excel
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] w-full max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Tạo hàng loạt với file excel</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <div className="mb-4 mt-2">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {data.length > 0 && (
            <div className="max-h-[calc(200px)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell key={-1}>STT</TableCell>
                    {data[0].map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell key={-1}>{rowIndex + 1}</TableCell>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <div className="my-2 flex justify-end gap-4">
            <Button onClick={check}>Kiểm tra</Button>
            <Button className>Xác nhận</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
