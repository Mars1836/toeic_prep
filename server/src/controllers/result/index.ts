import { Request, Response } from "express";
import ResultSrv from "../../services/result";
import { ResultAttr } from "../../models/result.model";

namespace ResultCtrl {
  export async function create(req: Request, res: Response) {
    const data = req.body as ResultAttr;
    data.userId = req.user!.id;
    const rs = await ResultSrv.create(data);
    res.status(200).json(rs);
  }
  export async function creataWithItems(req: Request, res: Response) {
    const { rs, rsis } = req.body;
    const data = { rs, rsis };
    data.rs.userId = req.user!.id;
    const _rs = await ResultSrv.creataWithItems(data);
    res.status(200).json(_rs);
  }
  export async function getByTest(req: Request, res: Response) {
    const { testId } = req.query;
    const data = { testId: testId as string, userId: req.user!.id };
    const rs = await ResultSrv.getByTest(data);
    res.status(200).json(rs);
  }
  export async function getByUser(req: Request, res: Response) {
    const data = { userId: req.user!.id };
    const rs = await ResultSrv.getByUser(data);
    res.status(200).json(rs);
  }
}
export default ResultCtrl;
