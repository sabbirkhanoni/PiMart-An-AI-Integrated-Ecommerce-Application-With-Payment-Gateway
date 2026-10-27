import CouponModel from "../models/coupon.model.js";

// 1. Create Coupon (Admin)
export const createCouponController = async (request, response) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      validFrom,
      validUntil,
      isActive,
    } = request.body;

    if (!code || !discountValue || !validUntil) {
      return response.status(400).json({
        message: "Please provide coupon code, discount value, and expiration date.",
        error: true,
        success: false,
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if code already exists
    const existingCoupon = await CouponModel.findOne({ code: cleanCode });
    if (existingCoupon) {
      return response.status(400).json({
        message: `Coupon code '${cleanCode}' already exists.`,
        error: true,
        success: false,
      });
    }

    const newCoupon = new CouponModel({
      code: cleanCode,
      description: description || "",
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 0,
      usageLimit: Number(usageLimit) || 100,
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: new Date(validUntil),
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedCoupon = await newCoupon.save();

    return response.status(201).json({
      message: "Coupon created successfully!",
      error: false,
      success: true,
      data: savedCoupon,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 2. Get All Coupons (Admin)
export const getAllCouponsAdminController = async (request, response) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });

    return response.status(200).json({
      message: "Coupons fetched successfully.",
      error: false,
      success: true,
      data: coupons,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 3. Update Coupon (Admin)
export const updateCouponController = async (request, response) => {
  try {
    const { _id, ...updateData } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Coupon _id is required.",
        error: true,
        success: false,
      });
    }

    if (updateData.code) {
      updateData.code = updateData.code.trim().toUpperCase();
      // Ensure unique if code was updated
      const duplicate = await CouponModel.findOne({
        code: updateData.code,
        _id: { $ne: _id },
      });
      if (duplicate) {
        return response.status(400).json({
          message: `Coupon code '${updateData.code}' is already used by another coupon.`,
          error: true,
          success: false,
        });
      }
    }

    const updatedCoupon = await CouponModel.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return response.status(404).json({
        message: "Coupon not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Coupon updated successfully.",
      error: false,
      success: true,
      data: updatedCoupon,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// 4. Delete Coupon (Admin)
export const deleteCouponController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Coupon _id is required.",
        error: true,
        success: false,
      });
    }

    const deleted = await CouponModel.findByIdAndDelete(_id);

    if (!deleted) {
      return response.status(404).json({
        message: "Coupon not found.",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Coupon deleted successfully.",
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

// 5. Apply / Validate Coupon (Customer)
export const applyCouponController = async (request, response) => {
  try {
    const { code, subtotal } = request.body;

    if (!code || typeof code !== "string") {
      return response.status(400).json({
        message: "Please enter a valid coupon code.",
        error: true,
        success: false,
      });
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (orderSubtotal <= 0) {
      return response.status(400).json({
        message: "Your cart is empty or invalid order subtotal.",
        error: true,
        success: false,
      });
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await CouponModel.findOne({ code: cleanCode });

    if (!coupon) {
      return response.status(404).json({
        message: `Coupon code '${cleanCode}' is invalid or does not exist.`,
        error: true,
        success: false,
      });
    }

    if (!coupon.isActive) {
      return response.status(400).json({
        message: `Coupon code '${cleanCode}' is currently deactivated.`,
        error: true,
        success: false,
      });
    }

    const now = new Date();
    if (coupon.validFrom && now < new Date(coupon.validFrom)) {
      return response.status(400).json({
        message: `This coupon will become active on ${new Date(coupon.validFrom).toLocaleDateString()}.`,
        error: true,
        success: false,
      });
    }

    if (now > new Date(coupon.validUntil)) {
      return response.status(400).json({
        message: `Coupon '${cleanCode}' expired on ${new Date(coupon.validUntil).toLocaleDateString()}.`,
        error: true,
        success: false,
      });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return response.status(400).json({
        message: `This coupon has reached its maximum global usage limit.`,
        error: true,
        success: false,
      });
    }

    if (orderSubtotal < coupon.minOrderAmount) {
      return response.status(400).json({
        message: `Minimum order amount of ৳${coupon.minOrderAmount} is required to apply '${cleanCode}'.`,
        error: true,
        success: false,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else {
      // flat discount in BDT
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    }

    const payableAmount = Math.max(0, orderSubtotal - discountAmount);

    return response.status(200).json({
      message: `Coupon '${cleanCode}' applied successfully! Saved ৳${discountAmount}`,
      error: false,
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discountAmount,
        minOrderAmount: coupon.minOrderAmount,
        payableAmount: payableAmount,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
