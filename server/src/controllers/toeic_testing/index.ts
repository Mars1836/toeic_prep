import { Request, Response } from "express";
import ToeicTestingSrv from "../../services/toeic_testing";
import { TestStatus } from "../../models/toeic_testing.model";
import { getPaginationParams, createPaginatedResponse } from "../../utils";
import TestRegistrationSrv from "../../services/test_registration";

namespace ToeicTestingCtrl {
  export async function create(req: Request, res: Response) {
    const toeicTesting = await ToeicTestingSrv.create(req.body);
    res.status(201).json(toeicTesting);
  }

  export async function createMany(req: Request, res: Response) {
    const { tests } = req.body;
    if (!Array.isArray(tests)) {
      return res.status(400).json({
        message: "Invalid request body. 'tests' must be an array",
      });
    }
    const toeicTestings = await ToeicTestingSrv.createMany(tests);
    res.status(201).json(toeicTestings);
  }

  export async function getAll(req: Request, res: Response) {
    const paginationParams = getPaginationParams(req.query);
    const { tests, total } = await ToeicTestingSrv.getAll(paginationParams);
    res
      .status(200)
      .json(createPaginatedResponse(tests, total, paginationParams));
  }

  export async function getById(req: Request, res: Response) {
    const { id } = req.params;
    const toeicTesting = await ToeicTestingSrv.getById(id);
    if (!toeicTesting) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(toeicTesting);
  }

  export async function getPendingTests(req: Request, res: Response) {
    const paginationParams = getPaginationParams(req.query);
    const { tests, total } = await ToeicTestingSrv.getTestsByFilter(
      { status: TestStatus.PENDING },
      paginationParams
    );

    res
      .status(200)
      .json(createPaginatedResponse(tests, total, paginationParams));
  }

  export async function getTestsByFilter(req: Request, res: Response) {
    const { status, isNotDone, isPending, isCompleted } = req.query;
    const paginationParams = getPaginationParams(req.query);

    const filters: any = {};

    if (status) {
      filters.status = status as TestStatus;
    }
    if (isNotDone === "true") {
      filters.isNotDone = true;
    }
    if (isPending === "true") {
      filters.isPending = true;
    }
    if (isCompleted === "true") {
      filters.isCompleted = true;
    }

    const { tests, total } = await ToeicTestingSrv.getTestsByFilter(
      filters,
      paginationParams
    );
    res
      .status(200)
      .json(createPaginatedResponse(tests, total, paginationParams));
  }
  export async function getPendingTestsByUser(req: Request, res: Response) {
    //@ts-ignore
    const userId = req.user.id;
    const paginationParams = getPaginationParams(req.query);
    const { tests, total } = await ToeicTestingSrv.getPendingTestsByUser(
      userId,
      paginationParams
    );
    res
      .status(200)
      .json(createPaginatedResponse(tests, total, paginationParams));
  }
}

export default ToeicTestingCtrl;
