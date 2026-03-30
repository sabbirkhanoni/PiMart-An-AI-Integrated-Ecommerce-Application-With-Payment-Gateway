import { useSelector } from "react-redux";
import PersonalAddressComp from "../components/DesignModel/PersonalAddressComp";
import { useEffect } from "react";


const PersonalAddress = () => {

  const deliveryAddress = useSelector(
      (state) => state?.deliveryAddress?.address,
    );

  return (
    <section>
      <PersonalAddressComp address={deliveryAddress}/>
    </section>
  )
}

export default PersonalAddress