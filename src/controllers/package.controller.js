import mongoose from "mongoose";
import Package from "../models/package.model.js";

//  PUBLIC CONTROLLERS

// Get all packages
export const getPackages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { status, search, category, subCategory } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }
    if (category) {
      filter.category = category;
    }
    if (subCategory) {
      console.log(subCategory);
      filter.subCategory = subCategory;
    }

    const totalPackages = await Package.countDocuments(filter);
    const packages = await Package.find(filter)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPackages,
      totalPages: Math.ceil(totalPackages / limit),
      data: packages,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get specific package details
export const packageDetail = async (req, res) => {
  try {
    const packageID = req.params.id;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID.",
      });
    }

    const findPackage = await Package.findById(packageID);

    // Check package exists or not
    if (!findPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package found successfully.",
      data: findPackage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get featured packages
export const featuredPackage = async (req, res) => {
  try {
    const featuredPackages = await Package.find({
      is_featured: true,
    });

    return res.status(200).json({
      success: true,
      count: featuredPackages.length,
      data: featuredPackages,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================= ADMIN CONTROLLERS =======================

// Create new package
export const createPackages = async (req, res) => {
  try {
    const packageData = req.body;

    // Validate title
    if (!packageData.title || packageData.title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Package title is required.",
      });
    }

    // Validate category
    if (!packageData.category || packageData.category.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Package category is required.",
      });
    }

    // Generate slug
    const slug = packageData.title
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-");

    // Check duplicate package
    const existingPackage = await Package.findOne({
      $or: [{ title: packageData.title.trim() }, { slug }],
    });

    if (existingPackage) {
      return res.status(409).json({
        success: false,
        message: "Package already exists.",
      });
    }

    // Create package
    const newPackage = await Package.create({
      ...packageData,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: newPackage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update package
export const updatePackages = async (req, res) => {
  try {
    const packageID = req.params.id;
    const updatedData = req.body;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID.",
      });
    }

    // Generate new slug if title changes
    if (updatedData.title) {
      updatedData.slug = updatedData.title
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "-");
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      packageID,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    // Check package exists or not
    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package updated successfully.",
      data: updatedPackage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete package
export const deletePackages = async (req, res) => {
  try {
    const packageID = req.params.id;

    // Validate package ID
    if (!mongoose.Types.ObjectId.isValid(packageID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid package ID.",
      });
    }

    const deletedPackage = await Package.findByIdAndDelete(packageID);

    // Check package exists or not
    if (!deletedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully.",
      data: deletedPackage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
