import { Schema, Types } from "mongoose";

export enum SlideGenerationStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
}

export interface Slide {
  name: string;
  context: string;
  file: string;
  pdfFile: string;
  originalContentFromUploadedDoc: string;
  owner: string;
  topic: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const slideSchema = new Schema<Slide>(
  {
    name: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
    originalContentFromUploadedDoc: {
      type: String,
      required: false,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
    },
    pdfFile: {
      type: String,
      required: false,
    },
    file: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: SlideGenerationStatus,
      default: SlideGenerationStatus.PROCESSING,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret, __) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);
