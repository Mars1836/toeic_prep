"use client";
//Tạo hàng loạt
import { useEffect, useRef, useState } from "react";
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
import instance from "~configs/axios.instance";
import { endpoint, originUrlUpload } from "~consts";

export default function ExcelUploader({ setId, setFlashcards }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataHandled, setDataHandled] = useState(null);
  const fileInputRef = useRef(null);

  const header = [
    "word",
    "translation",
    "definition",
    "example1",
    "example2",
    "note",
    "partOfSpeech",
    "pronunciation",
  ];
  const fillCols = [0, 1];
  const clearData = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setData([]);
    setDataHandled(null);
    setError(null);
    setIsLoading(false);
  };
  const checkValueTable = () => {
    const check = data.every((item, index) => {
      const check2 = fillCols.every((col) => {
        if (!item[col]) {
          toast.error(`Trường ${data[0][col]} ở hàng ${index} phải được nhập`);
          return false;
        }
        return true;
      });
      return check2;
    });
    return check;
  };
  const checkHeader = () => {
    // Check if the lengths are the same
    if (!data[0]) {
      toast.error("Chưa nhập dữ liệu");
      return false;
    }
    if (header?.length !== data[0].length) {
      toast.error("Tiêu đề các cột bị sai!");
      return false;
    }
    const check = header.every((item, index) => {
      return item === data[0][index].trim();
    });
    if (!check) {
      toast.error("Tiêu đề các cột bị sai!");
      return false;
    }

    return true;
  };
  function check() {
    if (checkHeader() && checkValueTable()) {
      toast.success("File hợp lệ");
      handleData();
    }
  }
  async function handleSubmit() {
    if (!dataHandled) {
      toast.error("Dữ liệu chưa được kiểm tra");
    }
    const _data = dataHandled.map((item) => {
      return {
        ...item,

        setFlashcardId: setId,
      };
    });
    try {
      const { data: rs } = await instance.post(
        endpoint.flashcardItem.createMany,
        _data
      );
      if (rs) {
        toast.success("Thêm flashcard thành công");
        setFlashcards((pre) => {
          return [...rs, ...pre];
        });
        clearData();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
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
  function handleDownloadTemplate() {
    const url = originUrlUpload + "/template/file-mau-set-flashcard.xlsx";
    window.open(url, "_blank");
  }
  function handleData() {
    if (!data || data?.length === 0) {
      return;
    }
    if (data.length > 1) {
      const header = data[0];
      const list = [];

      for (let i = 1; i < data.length; i++) {
        const arr = data[i];
        const exampleSentence = [];
        const flashcardItem = {
          [header[0]]: arr[0],
          [header[1]]: arr[1],
          [header[2]]: arr[2],
          [header[3]]: arr[3],
          [header[4]]: arr[4],
          [header[5]]: arr[5],
          [header[6]]: arr[6],
          [header[7]]: arr[7],
        };
        if (arr[3]) {
          exampleSentence.push(arr[3]);
        }
        if (arr[4]) {
          exampleSentence.push(arr[4]);
        }
        flashcardItem.exampleSentence = exampleSentence;
        (flashcardItem.partOfSpeech = flashcardItem.partOfSpeech.split(",")),
          list.push(flashcardItem);
        setDataHandled(list);
      }
    }
  }
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <TableIcon className="mr-2 h-4 w-4" />
          Tạo hàng loạt
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] w-full max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Tạo hàng loạt với file excel</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <div className="mb-4 mt-2 flex gap-2">
            <Button
              variant="outline"
              className=""
              onClick={handleDownloadTemplate}
            >
              Tải file mẫu
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
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
            <Button onClick={handleSubmit} disabled={!dataHandled}>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
