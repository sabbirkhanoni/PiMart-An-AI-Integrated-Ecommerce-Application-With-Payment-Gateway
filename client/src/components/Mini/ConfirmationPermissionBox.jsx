import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const ConfirmationPermissionBox = ({
  close,
  cancel,
  confirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
}) => {
  const handleClose = close || cancel;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={confirm}
            className="flex-1 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition duration-200 shadow-sm cursor-pointer"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

ConfirmationPermissionBox.propTypes = {
  confirm: PropTypes.func.isRequired,
  close: PropTypes.func,
  cancel: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ConfirmationPermissionBox;
