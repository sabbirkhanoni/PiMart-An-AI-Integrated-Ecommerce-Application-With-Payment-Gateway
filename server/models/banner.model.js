import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    desktopImage: {
      type: String,
      required: [true, "Desktop banner image URL is required"],
    },
    mobileImage: {
      type: String,
      default: "",
    },
    linkUrl: {
      type: String,
      default: "/",
      trim: true,
    },
    tag: {
      type: String,
      default: "Exclusive Offer",
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ isActive: 1, priority: -1 });

const BannerModel = mongoose.model("Banner", bannerSchema);

export default BannerModel;
