import React from 'react'
import SuccessIcon from "../assets/verify.png"
import { Link, useLocation } from 'react-router-dom'

const Complete = () => {

  const location = useLocation();
  return (
      <section className='h-screen bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300'>
        <div className='h-full flex items-center justify-center'>
          <div className='border-1 p-10 rounded-xl bg-white border-gray-200 shadow-2xl flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                    <img src={SuccessIcon} alt="success" className='w-16 h-16' />
                    <h1 className='text-md text-center lg:text-2xl font-bold'>{location.state?.text}</h1>
                    <Link to="/" className='text-sm font-semibold text-white bg-blue-500 py-2 px-2 rounded-full hover:bg-blue-700 transition-colors duration-300'>
                        Back to Home
                    </Link>
                </div>
          </div>
        </div>
      </section>
  )
}

export default Complete
