import React, { useState } from 'react'
import { HomeIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const AddressCard = ({ address, index , setSelectedAddress, selectedAddress }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-blue-500 ${selectedAddress === index ? "bg-blue-200" : "bg-blue-50"} shadow-sm`}>
    <div className="h-[3px] bg-gradient-to-r from-blue-500 to-teal-400" />
      <label htmlFor={`address-${index}`} className="cursor-pointer">
        <div className="pl-3 py-2 hover:bg-green-100 hover:border-green-300 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-300 hover:bg-blue-500">
                <input id={`address-${index}`} type="radio" checked={selectedAddress === index} value={index} onChange={() => setSelectedAddress(index)} name="address" className={`cursor-pointer h-5 w-5`} />
            </div>

            <div>
                <p className="text-sm font-medium text-gray-900">
                {address.homeName}
                </p>
            </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-3">
            <div className="flex items-start gap-2">
                <MapPinIcon size={13} className="mt-0.5 text-gray-400 shrink-0"/>
                <div className="text-[13px]">
                <p className="text-gray-900">{address.roadName}</p>
                <p className="text-gray-900">
                    {address.zipCode} · {address.city}
                </p>
                <p className="text-gray-400">{address.country}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <PhoneIcon size={13} className="text-gray-400 shrink-0" />
                <p className="text-[13px] text-gray-900">
                {address.mobile}
                </p>
            </div>

            </div>
      </div>
      </label>
    </div>
  )
}

export default AddressCard
