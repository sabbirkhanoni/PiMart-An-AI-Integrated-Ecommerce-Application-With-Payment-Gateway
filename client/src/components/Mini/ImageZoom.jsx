import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

const ImageZoom = ({ url, close }) => {
  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[10001] p-4 cursor-zoom-out"
      onClick={close}
    >
      <div
        className="relative max-w-3xl max-h-[88vh] p-3 bg-white rounded-2xl shadow-2xl flex flex-col items-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute -top-3 -right-3 bg-white text-gray-700 hover:text-black p-1.5 rounded-full shadow-lg border border-gray-200 cursor-pointer transition-transform hover:scale-110"
        >
          <IoClose size={20} />
        </button>
        <img
          src={url}
          alt="Product Zoom"
          className="max-w-full max-h-[80vh] object-contain rounded-xl"
        />
      </div>
    </div>,
    document.body
  );
};

ImageZoom.propTypes = {
  url: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

export default ImageZoom;