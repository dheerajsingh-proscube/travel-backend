import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['contact', 'inquiry'],
    },

    message: String,

    status: {
      type: String,
      enum: ["new", "contacted", "closed", "spam"],
      default: "new",
    },

    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  },
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
