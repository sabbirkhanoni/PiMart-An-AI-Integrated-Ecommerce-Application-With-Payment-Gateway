import { useState, useEffect, useRef } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductDisplayCard from "./DesignModel/ProductDisplayCard";
import { Sparkles, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import ProductSkeletonCardLoading from "./Mini/ProductSkeletonCardLoading";

const PersonalizedRecommendationsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badge, setBadge] = useState("Recommended For You");
  const [isPersonalized, setIsPersonalized] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          ...SummaryApi.getPersonalizedRecommendations,
        });

        if (response.data.success && response.data.data?.length > 0) {
          setProducts(response.data.data);
          setBadge(response.data.badge || "Recommended For You");
          setIsPersonalized(response.data.isPersonalized || false);
        }
      } catch {
        // Silently fail if not available
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="my-6 bg-gradient-to-r from-blue-50/50 via-indigo-50/40 to-purple-50/50 rounded-3xl p-4 md:p-6 border border-blue-100/80 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
              {isPersonalized ? <Sparkles size={13} className="text-amber-300" /> : <Flame size={13} className="text-amber-300" />}
              <span>{badge}</span>
            </span>
          </div>
          <h2 className="text-lg md:text-2xl font-black text-gray-900 mt-1.5 flex items-center gap-2">
            <span>Tailored Handpicked Picks</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isPersonalized
              ? "Curated recommendations based on your favorite categories and order history"
              : "Discover trending top-rated products customers love right now"}
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        {products.length > 4 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleScrollLeft}
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleScrollRight}
              className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Products Carousel Scroll */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 py-2">
          {new Array(6).fill(0).map((_, idx) => (
            <ProductSkeletonCardLoading key={idx} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3 overflow-x-auto scrollbar-none py-2 scroll-smooth"
        >
          {products.map((product, index) => (
            <div
              key={product._id + "rec" + index}
              className="w-40 sm:w-44 md:w-52 shrink-0 flex"
            >
              <ProductDisplayCard productData={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PersonalizedRecommendationsSection;
