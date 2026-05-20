import mongoose, { type InferSchemaType } from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Lost",
      ],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    activities: [
      {
        action: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
      }
    ]
  },
  {
    timestamps: true,
  }
);

leadSchema.index({
  organization: 1,
  email: 1,
});

export type LeadDocument = InferSchemaType<
  typeof leadSchema
> &
  mongoose.Document;

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
