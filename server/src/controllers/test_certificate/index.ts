import { Request, Response } from "express";
import TestCertificateSrv from "../../services/test_certificate";

namespace TestCertificateCtrl {
  export async function create(req: Request, res: Response) {
    try {
      const certificate = await TestCertificateSrv.create(req.body);
      res.status(201).json(certificate);
    } catch (error) {
      res.status(400).json({ message: "Failed to create certificate", error });
    }
  }

  export async function getAll(req: Request, res: Response) {
    try {
      const certificates = await TestCertificateSrv.getAll();
      res.status(200).json(certificates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certificates", error });
    }
  }

  export async function getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const certificate = await TestCertificateSrv.getById(id);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json(certificate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certificate", error });
    }
  }

  export async function getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const certificates = await TestCertificateSrv.getByUserId(userId);
      res.status(200).json(certificates);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch user certificates", error });
    }
  }

  export async function updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const certificate = await TestCertificateSrv.updateStatus(id, status);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json(certificate);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update certificate status", error });
    }
  }

  export async function updateScore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { score } = req.body;
      const certificate = await TestCertificateSrv.updateScore(id, score);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json(certificate);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update certificate score", error });
    }
  }

  export async function getValidCertificates(req: Request, res: Response) {
    try {
      const certificates = await TestCertificateSrv.getValidCertificates();
      res.status(200).json(certificates);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch valid certificates", error });
    }
  }
}

export default TestCertificateCtrl;
