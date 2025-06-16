import crypto from "crypto";
import { LearningFlashcardAttr } from "../models/learning_flashcard";
import mongoose from "mongoose";
export * from "./otp.generate";
import jwt from "jsonwebtoken";
import { readScore, listenScore } from "../const/toeic";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export function generateMac(data: string, key: string) {
  return crypto
    .createHmac("sha256", key) // Sử dụng HMAC với SHA-256
    .update(data) // Cập nhật dữ liệu đầu vào
    .digest("hex"); // Chuyển đổi kết quả thành chuỗi hexa
}
function getDiffDays(optimalTime: Date) {
  return (
    (new Date(optimalTime).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  );
}
export function getRateDiffDays(learningFlashcard: LearningFlashcardAttr) {
  if (!learningFlashcard.optimalTime || !learningFlashcard.interval) {
    return 0.2;
  }
  // Tính số ngày khác biệt giữa optimalTime và ngày hiện tại
  const diffDays = getDiffDays(learningFlashcard.optimalTime);

  // Tính tỉ lệ giữa diffDays và interval
  let rate = diffDays / learningFlashcard.interval;

  // Nếu tỉ lệ không hợp lệ, gán rate = 0.2
  if (!isFinite(rate)) {
    rate = 0.2;
  }

  return rate;
}
export function getTimeLastNDays(n: number) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const nDaysAgo = new Date();
  nDaysAgo.setDate(today.getDate() - n);
  nDaysAgo.setHours(0, 0, 0, 0);
  return { from: nDaysAgo, to: today };
}
export function cleanNullFieldObject(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
}
export function getStartOfPeriod(date: Date, step: number) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
export function formatDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

interface BaseData {
  _id?: any;
  __v?: any;
  [key: string]: any;
}

type TransformableData = mongoose.Document | BaseData | null | any;
type TransformedData = { id?: any; [key: string]: any } | null;

export function transformId(data: TransformableData): TransformedData {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map((item: TransformableData) =>
      transformId(item)
    ) as TransformedData[];
  }

  if (data instanceof mongoose.Document) {
    data = data.toObject();
  }

  const result: BaseData = { ...data };
  if (result._id) {
    result.id = result._id;
    delete result._id;
  }

  if (result.__v) {
    delete result.__v;
  }

  return result;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getPaginationParams(query: any): PaginationParams {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  return { page, limit };
}

export function getPaginationSkip(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
export function createToken(data: any, expiresIn: string) {
  return jwt.sign(data, process.env.JWT_SECRET_LOCAL!, {
    expiresIn,
  });
}
export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET_LOCAL!);
}
export function decodeToken(token: string) {
  return jwt.decode(token, { json: true });
}

export function calculateToeicScore(
  correctReading: number,
  correctListening: number
) {
  // Ensure scores are within valid ranges
  const readingScore = Math.min(Math.max(correctReading, 0), 100);
  const listeningScore = Math.min(Math.max(correctListening, 0), 100);

  // Get scaled scores from the conversion tables
  const scaledReadingScore =
    readScore[readingScore as keyof typeof readScore] || 5;
  const scaledListeningScore =
    listenScore[listeningScore as keyof typeof listenScore] || 5;

  // Calculate total score
  const totalScore = scaledReadingScore + scaledListeningScore;

  return {
    reading: scaledReadingScore,
    listening: scaledListeningScore,
    total: totalScore,
  };
}
