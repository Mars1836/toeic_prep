import { Request, Response } from "express";
import ToeicTestSessionSrv from "../../services/toeic_test_session";
import TestRegistrationSrv from "../../services/test_registration";
import { TestRegistrationDoc } from "../../models/test_registration.model";
import { createPaginatedResponse, getPaginationParams } from "../../utils";

namespace ToeicTestSessionCtrl {
  export async function create(req: Request, res: Response) {
    try {
      const { testId, toeicTestId } = req.body;
      const session = await ToeicTestSessionSrv.createSessionWithRegistrations(
        testId,
        toeicTestId
      );

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create test session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  export async function getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { sessions, total } = await ToeicTestSessionSrv.getAll(page, limit);

      res.status(200).json({
        success: true,
        data: sessions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch test sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  export async function getSessionByUserIdAndId(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.id;
      const { id } = req.params;
      const session = await ToeicTestSessionSrv.getSessionByUserIdAndId(
        userId,
        id
      );
      res.status(200).json(session);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch session" });
    }
  }
  export async function getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await ToeicTestSessionSrv.getById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Test session not found",
        });
      }

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch test session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const session = await ToeicTestSessionSrv.update(id, req.body);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Test session not found",
        });
      }

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update test session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function deleteSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await ToeicTestSessionSrv.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Test session not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Test session deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete test session",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function addParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const session = await ToeicTestSessionSrv.addParticipant(id, userId);
      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to add participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function removeParticipant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const session = await ToeicTestSessionSrv.removeParticipant(id, userId);
      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to remove participant",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getSessionsByTestId(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      const sessions = await ToeicTestSessionSrv.getSessionsByTestId(testId);
      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch test sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getSessionsByTestingId(req: Request, res: Response) {
    try {
      const { testingId } = req.params;
      const sessions = await ToeicTestSessionSrv.getSessionsByTestingId(
        testingId
      );
      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch test sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getSessionsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const paginationParams = getPaginationParams(req.query);
      const { sessions, total } = await ToeicTestSessionSrv.getSessionsByUserId(
        userId,
        paginationParams
      );
      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch test sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getMySessions(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.id;
      const paginationParams = getPaginationParams(req.query);
      const { sessions, total } = await ToeicTestSessionSrv.getSessionsByUserId(
        userId,
        paginationParams
      );
      res
        .status(200)
        .json(createPaginatedResponse(sessions, total, paginationParams));
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your test sessions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  export async function getExamByToken(req: Request, res: Response) {
    try {
      const { token } = req.query;
      const { test, exam } = await ToeicTestSessionSrv.getExamByToken(
        token as string
      );
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch exam",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default ToeicTestSessionCtrl;
