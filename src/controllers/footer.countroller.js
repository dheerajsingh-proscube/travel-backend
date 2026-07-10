import mongoose from "mongoose";
import Footer from "../models/footerSetting.model.js";

// public route
export const footerContent = async (req, res) => {
  try {
    const footerData = await Footer.find();

    return res.status(200).json({
      success: true,
      count: footerData.length,
      data: footerData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for admin

// controller for footer settings
export const getFooterSettings = async (req, res) => {
  try {
    const footerSettings = await Footer.findOne();

    // check footer settings exist or not
    if (!footerSettings) {
      return res.status(404).json({
        success: false,
        message: "Footer settings not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Footer settings fetched successfully.",
      data: footerSettings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for updating the footer settings
export const updateFooter = async (req, res) => {
  try {
    const updatedData = req.body;

    // Validate sections if provided
    if (updatedData.sections && Array.isArray(updatedData.sections)) {
      for (const section of updatedData.sections) {
        // Validate section title
        if (!section.title || typeof section.title !== 'string' || !section.title.trim()) {
          return res.status(400).json({
            success: false,
            message: "Each section must have a valid title.",
          });
        }

        // Validate links if present
        if (section.links && Array.isArray(section.links)) {
          for (const link of section.links) {
            if (!link.label || typeof link.label !== 'string' || !link.label.trim()) {
              return res.status(400).json({
                success: false,
                message: `Each link in "${section.title}" must have a valid label.`,
              });
            }
            if (!link.href || typeof link.href !== 'string' || !link.href.trim()) {
              return res.status(400).json({
                success: false,
                message: `Each link in "${section.title}" must have a valid href.`,
              });
            }
            // Validate external is boolean if provided
            if (link.external !== undefined && typeof link.external !== 'boolean') {
              return res.status(400).json({
                success: false,
                message: `"external" must be a boolean value.`,
              });
            }
          }
        }
      }
    }

    // Find or create footer
    let footer = await Footer.findOne();

    if (!footer) {
      // Create new footer
      footer = new Footer({
        sections: updatedData.sections || []
      });
    } else {
      // Update existing footer
      footer.sections = updatedData.sections || [];
      // Optionally update timestamps if your schema has them
      // footer.updatedAt = new Date();
    }

    await footer.save();

    return res.status(200).json({
      success: true,
      message: "Footer updated successfully.",
      data: footer,
    });
  } catch (err) {
    console.error('Error updating footer:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};