import Country from "../models/country.model.js";

export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  // res.json({ msg: "Countries list for admin" });
};

// below controller are designed for the admin route's
// controller for creating new country
export const createCountry = async (req, res) => {
  try {
    const { name, continent } = req.body;

    // check validate name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    if (!continent || continent.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Continent is required.",
      });
    }
    // generate slug
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    // check does country already exist or not
    const countryExist = await Country.findOne({
      $or: [{ name: name.trim() }, { slug }],
    });

    if (countryExist) {
      return res.status(409).json({
        success: false,
        message: "Country already exists.",
      });
    }

    // creating new country
    const newCountry = await Country.create({
      name: name.trim(),
      continent,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Country created successfully",
      data: newCountry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for updating the country
export const updateCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const updateData = req.body;

    // check id is valid or not
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }

    // generate slug
    if (updateData.name) {
      updateData.slug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    // check country with given id exist or not
    const updatedCountry = await Country.findByIdAndUpdate(
      countryId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCountry) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Country updated successfully",
      data: updatedCountry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// controller for deleting the country
export const deleteCountry = async (req, res) => {
  try {
    const countryId = req.params.id;

    // check id is valid
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid country ID.",
      });
    }
    // deleting the country
    const deletedCountry = await Country.findByIdAndDelete(countryId);

    // check country exist or not
    if (!deletedCountry) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Country deleted successfully",
      data: deletedCountry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
