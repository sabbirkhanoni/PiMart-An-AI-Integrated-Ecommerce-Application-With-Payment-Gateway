import { MapPinIcon, PhoneIcon } from "lucide-react";
import React, { useState } from "react";
import AddressForm from "../ViewPageComponent/AddressForm";

const PersonalAddressComp = ({ address }) => {
  const [openAddressFormModel, setOpenAddressFormModel] = useState(false);

  return (
    <section className="bg-white">
      {address.map((address, index) => {
        return (
          <div className="m-3 ">
            <div
              className={`relative overflow-hidden rounded-xl border border-blue-500 "bg-blue-50 shadow-sm "`}
            >
              <div className="h-[3px] bg-gradient-to-r from-blue-500 to-teal-400" />
              <div className="pl-3 py-2 hover:bg-green-100 hover:border-green-300 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {address.homeName}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPinIcon
                      size={13}
                      className="mt-0.5 text-gray-400 shrink-0"
                    />
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
            </div>

            {openAddressFormModel && (
              <AddressForm close={() => setOpenAddressFormModel(false)} />
            )}
          </div>
        );
      })}

      <div
        onClick={() => setOpenAddressFormModel(true)}
        className="py-2 cursor-pointer w-full rounded-full bg-blue-500 text-white text-center"
      >
        Set up your delivery address
      </div>
    </section>
  );
};

export default PersonalAddressComp;
