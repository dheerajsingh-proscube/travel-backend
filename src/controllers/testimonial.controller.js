import mongoose from "mongoose";
import Testimonial from "../models/testimonial.model.js";

// controller for public route
export const getTestimonials = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || null;
    const featured = req.query.featured;

    const filter = {}

    if (featured) {
      filter.featured = featured;
    }



    const testimonials = await Testimonial.find(filter).limit(limit);

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTestimonialCount = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();

    return res.status(200).json({
      success: true,
      count,
      message: "Testimonial count fetched successfully",
    });
  } catch (error) {
    console.error("Get Testimonial Count Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial count",
      error: error.message,
    });
  }
};

// controller for admin route's

// controller to create new testimonial

export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
      error: error.message
    });
  }
};

export const createTestimonials = async (req, res) => {
  try {
    const testimonialData = req.body;

    // validate traveler name
    if (
      !testimonialData.travelerName ||
      testimonialData.travelerName.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Traveler name is required.",
      });
    }

    // create testimonial
    const newTestimonial = await Testimonial.create(testimonialData);

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: newTestimonial,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller to update the testimonial
export const updateTestimonials = async (req, res) => {
  try {
    const testimonialID = req.params.id;
    const updatedData = req.body;

    // check testimonial ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(testimonialID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      testimonialID,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    // check testimonial exist or not
    if (!updatedTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: updatedTestimonial,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller to delete the testimonial
export const deleteTestimonials = async (req, res) => {
  try {
    const testimonialID = req.params.id;

    // check testimonial ID is valid or not
    if (!mongoose.Types.ObjectId.isValid(testimonialID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(
      testimonialID,
    );

    // check testimonial exist or not
    if (!deletedTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
      data: deletedTestimonial,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};