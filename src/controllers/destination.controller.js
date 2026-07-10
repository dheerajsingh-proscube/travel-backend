import Destination from "../models/destination.model.js";
import mongoose from "mongoose";
import Footer from "../models/footerSetting.model.js";

// public route
export const getDestination = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { search, type } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (type) {
      filter.type = type;
    }

    const totalDestination = await Destination.countDocuments(filter);
    const destinations = await Destination.find(filter).skip(skip).limit(limit);
    res.status(200).json({
      success: true,
      page,
      limit,
      totalDestination,
      totalPages: Math.ceil(totalDestination / limit),
      data: destinations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get specific destination
export const destinationDetail = async (req, res) => {
  try {
    const destinationID = req.params.id;

    // check destinationID is valid or not
    if (!mongoose.Types.ObjectId.isValid(destinationID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination ID.",
      });
    }

    const findDestination = await Destination.findById(destinationID);

    // check destination exist or not in database
    if (!findDestination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Destination found successfully",
      data: findDestination,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// admin controller
// controller for creating new destination
export const createDestination = async (req, res) => {
  try {
    const {
      countryId,
      title,
      description,
      heroImage,
      gallery,
      type,
      isFeatured,
      isActive,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Destination title is required.",
      });
    }

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-");

    const existingDestination = await Destination.findOne({
      $or: [{ title: title.trim() }, { slug }],
    });

    if (existingDestination) {
      return res.status(409).json({
        success: false,
        message: "Destination already exists.",
      });
    }

    const newDestination = await Destination.create({
      countryId,
      title: title.trim(),
      slug,
      type,
      description,
      heroImage,
      gallery,
      isFeatured,
      isActive,
    });

    if (newDestination.isFeatured) {
      const footer = await Footer.findOne();

      if (footer) {
        const sectionIndex = newDestination.type === "international" ? 0 : 1;

        footer.sections[sectionIndex].links.push({
          label: newDestination.title,
          href: `/${newDestination.slug}`,
          destinationId: newDestination._id,
        });

        await footer.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: "Destination created successfully.",
      data: newDestination,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for updating the destination
export const updateDestination = async (req, res) => {
  try {
    const destinationId = req.params.id;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination ID.",
      });
    }

    // Update slug if title changes
    if (updateData.title) {
      updateData.slug = updateData.title
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "-");
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDestination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const footer = await Footer.findOne();

    if (footer) {
      const isInternational = updatedDestination.type === "international";
      const sectionIndex = isInternational ? 0 : 1;

      const links = footer.sections[sectionIndex].links;
      footer.sections[sectionIndex].links = links.filter(
        (link) => link.destinationId?.toString() !== destinationId,
      );

      if (updatedDestination.isFeatured) {
        footer.sections[sectionIndex].links.push({
          label: updatedDestination.title,
          href: `/${updatedDestination.slug}`,
          destinationId: updatedDestination._id,
        });
      }
      await footer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Destination updated successfully.",
      data: updatedDestination,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for deleting the destination
export const deleteDestination = async (req, res) => {
  try {
    const destinationId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid destination ID.",
      });
    }

    const deletedDestination =
      await Destination.findByIdAndDelete(destinationId);

    if (!deletedDestination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found.",
      });
    }

    const footer = await Footer.findOne();

    if (footer) {
      const isInternational = deletedDestination.type === "international";
      const sectionIndex = isInternational ? 0 : 1;

      footer.sections[sectionIndex].links =
        footer.sections[sectionIndex].links.filter(
          (link) => link.destinationId?.toString() !== destinationId
        );

      await footer.save();
    }

    return res.status(200).json({
      success: true,
      message: "Destination deleted successfully.",
      data: deletedDestination,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
