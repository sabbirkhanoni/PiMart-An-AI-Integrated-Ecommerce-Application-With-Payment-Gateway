import PropTypes from 'prop-types';

const ConfirmationPermissionBox = ({close , confirm }) => {
  return (
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
      >
        <div
          className="bg-white max-w-sm w-full rounded-2xl shadow-2xl p-6 text-center space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-25">
            <button
              onClick={confirm}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200"
            >
              Delete
            </button>
            <button
              onClick={close}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    
  );
};

ConfirmationPermissionBox.propTypes = {
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default ConfirmationPermissionBox;
