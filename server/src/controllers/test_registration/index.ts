import { Request, Response } from "express";
import TestRegistrationSrv from "../../services/test_registration";
import ToeicTestingSrv from "../../services/toeic_testing";
import { start } from "repl";

namespace TestRegistrationCtrl {
  export async function create(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.id;
      const examId = req.body.examId;
      const registration = await TestRegistrationSrv.create({
        userId,
        examId,
        personalInfo: req.body.personalInfo,
      });
      res.status(201).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create registration",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { registrations, total } = await TestRegistrationSrv.getAll(
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: registrations,
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
        message: "Failed to fetch registrations",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await TestRegistrationSrv.getById(id);

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch registration",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getByUserId(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.id;
      const registrations = await TestRegistrationSrv.getByUserId(userId);
      res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch user registrations",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getUpcomingRegistrations(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.id;
      const registrations =
        await TestRegistrationSrv.getUpcomingRegistrations();
      res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch upcoming registrations",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const registration = await TestRegistrationSrv.updateStatus(id, status);

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update registration status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getRegistrationsByDateRange(
    req: Request,
    res: Response
  ) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      const registrations =
        await TestRegistrationSrv.getRegistrationsByDateRange(
          startDate as string,
          endDate as string
        );

      res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch registrations by date range",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function cancelRegistration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await TestRegistrationSrv.getById(id);

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: "Registration not found",
        });
      }

      const updatedRegistration = await TestRegistrationSrv.updateStatus(
        id,
        "CANCELLED"
      );
      res.status(200).json({
        success: true,
        data: updatedRegistration,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to cancel registration",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getRegistrationsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const registrations = await TestRegistrationSrv.getRegistrationsByStatus(
        status
      );
      res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch registrations by status",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  export async function getRegistrationsByTestCenter(
    req: Request,
    res: Response
  ) {
    try {
      const { testCenter } = req.params;
      const registrations =
        await TestRegistrationSrv.getRegistrationsByTestCenter(testCenter);
      res.status(200).json({
        success: true,
        data: registrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch registrations by test center",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default TestRegistrationCtrl;
