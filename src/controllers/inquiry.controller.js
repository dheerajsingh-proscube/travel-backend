import Inquiry from "../models/inquiry.model.js";
import mongoose from "mongoose";

// public route
export const formSubmit = async (req, res) => {
  try {
    const data = req.body;
    const inquiry = await Inquiry.create(data);
    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      data: inquiry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for getting inquiries
export const getInquiries = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    const { type } = req.query;

    const filter = {};
    if (type) {
      filter.type = type;
    }

    const totalInquiries = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .populate(
        "packageId",
        "title slug price_num category price_num groupSize",
      )
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      page,
      limit,
      totalInquiries,
      totalPages:Math.ceil(totalInquiries/limit),
      data: inquiries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// controller for updating the inquiry status or solve queries
export const updateInquiryStatus = async (req, res) => {
  try {
    const inquiryID = req.params.id;
    const { status } = req.body;

    // check id is valid or not
    if (!mongoose.Types.ObjectId.isValid(inquiryID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID.",
      });
    }

    // check status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiryID,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedInquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry updated successfully",
      data: updatedInquiry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller to delete the inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const inquiryID = req.params.id;

    // check id is valid or not
    if (!mongoose.Types.ObjectId.isValid(inquiryID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    const deletedInquiry = await Inquiry.findByIdAndDelete(inquiryID);

    if (!deletedInquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry Deleted successfully",
      data: deletedInquiry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
