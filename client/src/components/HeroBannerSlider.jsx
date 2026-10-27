import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import largeBanner from "../assets/largeBanner.png";
import mobileSizeBanner from "../assets/mobileSize-banner.png";

const HeroBannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.getActiveBanners,
        });
        if (response.data.success && response.data.data?.length > 0) {
          setBanners(response.data.data);
        }
      } catch {
        // Silently fallback to default static banners
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanners();
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, isHovered]);

  const handlePrev = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // If no dynamic banners are created yet, render the elegant default static banner
  if (banners.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-gray-100 bg-white">
        <img
          src={largeBanner}
          alt="Banner"
          className="w-full h-auto object-cover rounded-2xl hidden md:block"
        />
        <img
          src={mobileSizeBanner}
          alt="Banner"
          className="w-full h-auto object-cover rounded-2xl md:hidden"
        />
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100 bg-white select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable Banner Slide */}
      <Link to={currentBanner?.linkUrl || "/"} className="block relative aspect-21/9 md:aspect-21/8 lg:aspect-21/7 overflow-hidden">
        {/* Desktop Image */}
        <img
          src={currentBanner?.desktopImage}
          alt={currentBanner?.title || "Promotion"}
          className="w-full h-full object-cover hidden md:block transition-all duration-700 ease-out animate-in fade-in"
        />

        {/* Mobile Image */}
        <img
          src={currentBanner?.mobileImage || currentBanner?.desktopImage}
          alt={currentBanner?.title || "Promotion"}
          className="w-full h-full object-cover md:hidden transition-all duration-700 ease-out animate-in fade-in"
        />

        {/* Gradient Overlay & Text Caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 md:p-6 lg:p-8 text-white">
          {currentBanner?.tag && (
            <span className="w-fit px-3 py-1 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs mb-2 flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-300" />
              <span>{currentBanner.tag}</span>
            </span>
          )}

          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black drop-shadow-md line-clamp-1">
            {currentBanner?.title}
          </h2>

          {currentBanner?.subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-white/90 drop-shadow line-clamp-1 mt-0.5">
              {currentBanner.subtitle}
            </p>
          )}
        </div>
      </Link>

      {/* Navigation Arrows (visible if more than 1 banner) */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
            title="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
            title="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dot Pagination */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? "w-6 h-1.5 bg-white shadow-xs"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroBannerSlider;
