import React from 'react'
import { useGlobalContext } from '../../contexts/GlobalContext';
import { calculatePriceWithDiscount } from '../../utils/calculatePriceWithDiscount';
import { DisplayPriceInBDT } from '../../utils/DisplayPriceInBDT';

const SaveAmount = () => {
  const { savedAmount } = useGlobalContext();

  return (

    <div className="fixed top-50 left-0 z-60  lg:block">
        {// you do animate open from right
        }
        {
            savedAmount > 0 && (
                <div className="bg-[#eeab46] text-black font-semibold px-2 py-2 rounded-r-full pr-4 lg:pr-6 text-xs lg:text-sm animate-slideInRight">
                    <h2>You saved</h2>
                    <p className="text-sm">{DisplayPriceInBDT(savedAmount)} BDT</p>
                </div>
            )
        }
    </div>
  )
}

export default SaveAmount
