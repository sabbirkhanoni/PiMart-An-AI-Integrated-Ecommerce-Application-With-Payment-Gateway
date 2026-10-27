import BannerModel from "../models/banner.model.js";

// 1. Create Banner (Admin)
export const createBannerController = async (request, response) => {
  try {
    const { title, subtitle, desktopImage, mobileImage, linkUrl, tag, priority, isActive } =
      request.body;

    if (!title || !desktopImage) {
      return response.status(400).json({
        message: "Title and Desktop Image are required.",
        error: true,
        success: false,
      });
    }

    const newBanner = new BannerModel({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      desktopImage,
      mobileImage: mobileImage || desktopImage,
      linkUrl: linkUrl || "/",
      tag: tag || "Special Offer",
      priority: Number(priority) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedBanner = await newBanner.save();

    return response.status(201).json({
      message: "Banner created successfully!",
      error: false,
      success: true,
      data: savedBanner,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 2. Get All Banners (Admin)
export const getAllBannersAdminController = async (request, response) => {
  try {
    const banners = await BannerModel.find().sort({ priority: -1, createdAt: -1 });

    return response.status(200).json({
      message: "Banners fetched successfully.",
      error: false,
      success: true,
      data: banners,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 3. Get Active Banners (Public - for Home Carousel)
export const getActiveBannersPublicController = async (request, response) => {
  try {
    const banners = await BannerModel.find({ isActive: true }).sort({
      priority: -1,
      createdAt: -1,
    });

    return response.status(200).json({
      message: "Active banners fetched successfully.",
      error: false,
      success: true,
      data: banners,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 4. Update Banner (Admin)
export const updateBannerController = async (request, response) => {
  try {
    const { _id, ...updateData } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Banner _id is required.",
        error: true,
        success: false,
      });
    }

    if (updateData.priority !== undefined) {
      updateData.priority = Number(updateData.priority) || 0;
    }

    const updated = await BannerModel.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return response.status(404).json({
        message: "Banner not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Banner updated successfully.",
      error: false,
      success: true,
      data: updated,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 5. Delete Banner (Admin)
export const deleteBannerController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Banner _id is required.",
        error: true,
        success: false,
      });
    }

    const deleted = await BannerModel.findByIdAndDelete(_id);

    if (!deleted) {
      return response.status(404).json({
        message: "Banner not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Banner deleted successfully.",
      error: false,
      success: true,
      data: deleted,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
