//@ts-nocheck
import { Request, Response } from "express";
import ExamResultSrv from "../../services/exam_result";
import { ExamResultAttr } from "../../models/exam_result";

namespace ExamResultCtrl {
  export async function create(req: Request, res: Response) {
    const data = req.body;
    //@ts-ignore
    data.userId = req.user!.id;
    const rs = await ExamResultSrv.create(data);
    res.status(200).json(rs);
  }
  export async function creataWithItems(req: Request, res: Response) {
    const { rs, rsis } = req.body;
    //@ts-ignore
    rs.userId = req.user!.id;
    const data = { rs, rsis };
    const _rs = await ExamResultSrv.creataWithItems(data);

    res.status(200).json(_rs);
  }
}
export default ExamResultCtrl;
