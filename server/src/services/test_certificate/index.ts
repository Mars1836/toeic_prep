import { TestCertificateAttr } from "../../models/test_certificate.model";
import { TestCertificate } from "../../models/test_certificate.model";

const TestCertificateSrv = {
  async create(data: TestCertificateAttr) {
    const certificate = await TestCertificate.create(data);
    return certificate;
  },

  async getAll() {
    const certificates = await TestCertificate.find()
      .populate("userId", "fullName email")
      .populate("testId", "testId testDate");
    return certificates;
  },

  async getById(id: string) {
    const certificate = await TestCertificate.findById(id)
      .populate("userId", "fullName email")
      .populate("testId", "testId testDate");
    return certificate;
  },

  async getByUserId(userId: string) {
    const certificates = await TestCertificate.find({ userId }).populate(
      "testId",
      "testId testDate"
    );
    return certificates;
  },

  async updateStatus(id: string, status: string) {
    const certificate = await TestCertificate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return certificate;
  },

  async updateScore(id: string, score: number) {
    const certificate = await TestCertificate.findByIdAndUpdate(
      id,
      { score },
      { new: true }
    );
    return certificate;
  },

  async getValidCertificates() {
    const currentDate = new Date();
    const certificates = await TestCertificate.find({
      status: "issued",
      expiryDate: { $gt: currentDate },
    }).populate("userId", "fullName email");
    return certificates;
  },
};

export default TestCertificateSrv;
