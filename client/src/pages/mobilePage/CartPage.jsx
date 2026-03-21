import React from 'react'
import CartModel from '../../components/DesignModel/CartModel'

const CartPage = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <CartModel setIsOpen={setIsOpen} />
    </div>
  )
}

export default CartPage
