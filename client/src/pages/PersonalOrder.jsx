import React from 'react'
import { useSelector } from 'react-redux';
import NoData from '../components/Mini/NoData';


const PersonalOrder = () => {

  const orderedProduct = useSelector(state => state.order.orderDataSet);
  console.log("orderedProduct", orderedProduct);
  return (
    <section className='h-screen top-0 left-0 right-0 bg-gray-100'>
      <div className='container mx-auto p-1 shadow-md flex items-center justify-center'>
        {
          orderedProduct[0] ? (
            <div className='bg-white p-3 rounded w-full'>
              <h2 className='text-lg font-semibold mb-2'>Your Orders</h2>
              <div className='grid grid-cols-2 gap-2'>
                {
                  orderedProduct.map((order, index) => {
                    return (
                      <div className='border border-blue-500 shadow-md bg-white rounded p-2 flex flex-col gap-2'>
                        <div key={index+"order"} className=''>
                          <p className='text-sm'>Order Id: {order.orderId}</p>
                          <img src={order.product_details.image} alt={order.product_details.name} className='w-20 h-20 object-cover' />
                          <h3 className='text-sm font-medium'>{order.product_details.name}</h3>
                          <span className='text-sm text-gray-600'>Price: {order.subTotalAmt} BDT</span>
                          <span className='text-sm text-gray-600'>Total: {order.totalAmt} BDT</span>
                        </div>

                        <div >
                          <p>{ order.paymentId ? <span>Payment Id: {order.paymentId}</span> : <span></span>}</p>
                          <p className='text-sm text-gray-600'>Payment Status: <span className={`${order.payment_status === 'Paid' ? 'text-green-600' : 'text-red-600'} font-semibold`}>{order.payment_status}</span></p>
                        </div>
                        <div className='flex flex-col bg-green-200/80 border-1 border-green-400 p-2 rounded'>
                          <p className='text-sm text-gray-600'>Delivered To:</p>
                          <span>{order.delivery_address.homeName}</span>
                          <span>{order.delivery_address.roadName}</span>
                          <span>{order.delivery_address.city}</span>
                          <span>{order.delivery_address.zipCode}</span>
                          <span>{order.delivery_address.country}</span>
                          <span>{order.delivery_address.mobile}</span>
                        </div>
                      </div>
                    );
                  })
                }

              </div>
            </div>
          ) : (
            <NoData />
          )
        }
      </div>
    </section>
  )
}

export default PersonalOrder
