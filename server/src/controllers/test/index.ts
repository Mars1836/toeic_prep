//@ts-nocheck
import { Request, Response } from "express";
import TestSrv from "../../services/test";
import { TestAttr } from "../../models/test.model";
import * as XLSX from "xlsx";

namespace TestCtrl {
  export async function create(req: Request, res: Response) {
    const data = req.body as TestAttr;
    const rs = await TestSrv.create(data);
    res.status(200).json(rs);
  }
  export async function getAll(req: Request, res: Response) {
    const rs = await TestSrv.getAll();
    res.status(200).json(rs);
  }
  export async function getByQuery(req: Request, res: Response) {
    const query = req.query;
    const rs = await TestSrv.getByQuery(query);
    res.status(200).json(rs);
  }
  export async function getByCode(req: Request, res: Response) {
    const { code } = req.query;
    const rs = await TestSrv.getByCode(code);
    res.status(200).json(rs);
  }
  export async function getById(req: Request, res: Response) {
    const { id } = req.query;
    const rs = await TestSrv.getById(id);
    res.status(200).json(rs);
  }
  export async function handleTest(req: Request, res: Response) {
    const linkExcel =
      "https://storage.googleapis.com/simpl-project138_cloudbuild/file/excel/exam.1.mini-test1.xlsx";
    const response = await fetch(linkExcel);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    res.status(200).json(jsonData);
  }
  export async function handleTest2(req: Request, res: Response) {
    const linkExcel =
      "https://storage.googleapis.com/simpl-project138_cloudbuild/file/excel/exam.1.mini-test1.xlsx";
    const response = await fetch(linkExcel);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    const list = [];
    if (jsonData.length > 1) {
      const header = jsonData[0];
      for (let i = 1; i < jsonData.length; i++) {
        const arr = jsonData[i];
        const questionItem = {
          id: arr[0],
          [header[0]]: arr[0],
          [header[1]]: arr[1],
          [header[2]]: arr[2],
          [header[3]]: arr[3],
          [header[4]]: arr[4],
          [header[5]]: arr[5],
          [header[6]]: arr[6],
          [header[7]]: arr[7],
          [header[8]]: arr[8],
          [header[9]]: arr[9],
        };
        const options = [arr[5], arr[6], arr[7], arr[8]];
        const labels = ["A", "B", "C", "D"];
        questionItem.options = options
          .map((op, index) => {
            if (!op) {
              return null;
            }
            return {
              id: labels[index],
              content: op,
            };
          })
          .filter((option) => option !== null);
        list.push(questionItem);
      }
    }
    res.status(200).json(list);
  }
}
export default TestCtrl;
