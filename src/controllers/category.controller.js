import Category from "../models/category.model.js";
import mongoose from "mongoose";

export const getCategoryData = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCategoryCount = async (req, res) => {
  try {
    const count = await Category.countDocuments();

    return res.status(200).json({
      success: true,
      count,
      message: "Category count fetched successfully",
    });
  } catch (error) {
    console.error("Get Category Count Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category count",
      error: error.message,
    });
  }
};

// controller for admin route's

// creating new category
export const saveCategories = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      categories = [],
      deletedIds = [],
    } = req.body;

    /*
    ------------------------------------
    DELETE
    ------------------------------------
    */

    if (deletedIds.length) {
      await Category.deleteMany({
        _id: {
          $in: deletedIds,
        },
      }).session(session);
    }

    /*
    ------------------------------------
    CREATE + UPDATE
    ------------------------------------
    */

    const operations = [];

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      const document = {
        name: category.name.trim(),
        slug:
          category.slug ||
          category.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-"),
        isActive: category.isActive,
        order: i + 1,
      };

      if (category._id) {
        operations.push({
          updateOne: {
            filter: {
              _id: category._id,
            },
            update: {
              $set: document,
            },
          },
        });
      } else {
        operations.push({
          insertOne: {
            document,
          },
        });
      }
    }

    if (operations.length) {
      await Category.bulkWrite(operations, {
        session,
      });
    }

    await session.commitTransaction();

    const updatedCategories = await Category.find()
      .sort({
        order: 1,
      });

    res.status(200).json({
      success: true,
      message: "Categories saved successfully.",
      data: updatedCategories,
    });
  } catch (err) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    session.endSession();
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // Generate slug
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    // Check if category already exists
    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      description,
      icon,
      isActive,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// updating category
export const updateCategory = async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No categories provided.",
      });
    }

    const operations = [];

    for (const category of categories) {
      if (!mongoose.Types.ObjectId.isValid(category._id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category ID: ${category._id}`,
        });
      }

      const updateData = {
        isActive: category.isActive,
      };

      if (category.name) {
        updateData.name = category.name;
        updateData.slug = category.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
      }

      operations.push({
        updateOne: {
          filter: { _id: category._id },
          update: { $set: updateData },
        },
      });
    }

    await Category.bulkWrite(operations);

    const updatedCategories = await Category.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Categories updated successfully.",
      data: updatedCategories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete category
export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // check id is valid or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    // check document exist or not
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
