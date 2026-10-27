import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

const AddNewFeildsComponent = ({ close, value, onChange, submit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return createPortal(
    <section className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[10001] flex items-center justify-center p-4">
      <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">Add Custom Field</h2>
          <button
            type="button"
            onClick={close}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Field Name</label>
            <input
              type="text"
              placeholder="e.g. Color, Brand, Warranty"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
            >
              Add Field
            </button>
          </div>
        </div>
      </div>
    </section>,
    document.body
  );
};

AddNewFeildsComponent.propTypes = {
  close: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

export default AddNewFeildsComponent;
