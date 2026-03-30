import { useSelector } from "react-redux";
import PersonalAddressComp from "../components/DesignModel/PersonalAddressComp";
import { useEffect } from "react";


const PersonalAddress = () => {

  const deliveryAddress = useSelector(
      (state) => state?.deliveryAddress?.address,
    );

  useEffect(() => {
    console.log("deliveryAddress", deliveryAddress);
  }, [deliveryAddress]);
  console.log("deliveryAddress", deliveryAddress);

  return (
    <section>
      <PersonalAddressComp address={deliveryAddress}/>
    </section>
  )
}

export default PersonalAddress