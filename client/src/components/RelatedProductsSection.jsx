import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductDisplayCard from "./DesignModel/ProductDisplayCard";
import { Package, Sparkles } from "lucide-react";
import ProductSkeletonCardLoading from "./Mini/ProductSkeletonCardLoading";

const RelatedProductsSection = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchRelated = async () => {
      try {
        setLoading(true);
        const response = await Axios({
          url: `${SummaryApi.getRelatedProducts.url}/${productId}`,
          method: SummaryApi.getRelatedProducts.method,
        });

        if (response.data.success) {
          setRelated(response.data.data || []);
        }
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId]);

  if (!loading && related.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 md:p-6 space-y-4 my-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Sparkles size={17} />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            Customers Also Viewed & Bought
          </h2>
          <p className="text-xs text-gray-500">
            Similar popular products from related categories
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {new Array(4).fill(0).map((_, idx) => (
            <ProductSkeletonCardLoading key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {related.map((item, idx) => (
            <ProductDisplayCard
              key={item._id + "rel" + idx}
              productData={item}
              className="w-full"
            />
          ))}
        </div>
      )}
    </section>
  );
};

RelatedProductsSection.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default RelatedProductsSection;
