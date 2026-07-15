/**
 * Category Controller
 */

const { successResponse, errorResponse } = require("../utils/responses");
const Category = require("../models/Category");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).lean();

    return res.status(200).json(
      successResponse(200, "Categories retrieved successfully", categories)
    );
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!category) {
      return res.status(404).json(
        errorResponse(404, "Category not found")
      );
    }

    return res.status(200).json(
      successResponse(200, "Category retrieved successfully", category)
    );
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json(
        errorResponse(400, "Category name is required")
      );
    }

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(400).json(
        errorResponse(400, "Category with this name already exists")
      );
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim(),
      image,
    });

    await category.save();

    return res.status(201).json(
      successResponse(201, "Category created successfully", category)
    );
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, active } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(
        errorResponse(404, "Category not found")
      );
    }

    if (name && name.trim() && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(400).json(
          errorResponse(400, "Category with this name already exists")
        );
      }

      category.name = name.trim();
    }

    if (description !== undefined) category.description = description?.trim();
    if (image !== undefined) category.image = image;
    if (active !== undefined) category.active = active;

    await category.save();

    return res.status(200).json(
      successResponse(200, "Category updated successfully", category)
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json(
        errorResponse(404, "Category not found")
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json(
      successResponse(200, "Category deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};
