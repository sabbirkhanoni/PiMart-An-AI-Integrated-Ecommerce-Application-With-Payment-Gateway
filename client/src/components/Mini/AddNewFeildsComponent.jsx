
import React from 'react'
import { IoClose } from 'react-icons/io5';

const AddNewFeildsComponent = ({close,value,onChange,submit}) => {
  return (
    <section
    className="fixed top-0 bottom-0 right-0 left-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-5 w-full max-w-md rounded">
        <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold">Add new Feilds</h2>
            <button onClick={close} className="text-gray-500 hover:text-gray-800 transition-all duration-300">
                <IoClose size={25}/>
            </button>
        </div>

        <div className="mt-4">
            <div>Feild Name</div>
            <input
                type="text"
                placeholder="Enter field name"
                className="border bg-blue-100 p-2 rounded-full w-full"
                value={value}
                onChange={onChange}
            />
            <button
                onClick={submit}
                className="bg-blue-500 text-white p-2 rounded-full mt-4 w-full hover:bg-blue-600 transition-all duration-300">
                Add
            </button>
        </div>

      </div>
    </section>
  )
}

export default AddNewFeildsComponent
