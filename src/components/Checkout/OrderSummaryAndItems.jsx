import React from 'react';
import Link from 'next/link';
import CartSummary from '@/components/Cart/CartSummary'; // Assuming this component already exists

export default function OrderSummaryAndItems({ cart, subtotal, shipping, total }) {
  return (
    <div className="lg:w-1/3">
      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        hideCheckoutButton={true} // Keep this true for checkout page
      />

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Items ({cart.length})</h3>
        {cart.map((cartItem) => (
          <div key={cartItem._id} className="flex items-center mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            <img
              src={cartItem.product?.image || '/placeholder-image.jpg'}
              alt={cartItem.product?.name || 'Product'}
              className="w-16 h-16 object-cover rounded-md mr-4 shadow-sm"
            />
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-800">{cartItem.product?.name}</h4>
              <p className="text-gray-600 text-sm">
                Qty: {cartItem.quantity} &times; ${cartItem.product?.price?.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold text-gray-800">
              ${((cartItem.product?.price || 0) * (cartItem.quantity || 0)).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="mt-4 text-center">
          <Link
            href="/cart"
            className="text-[#E30B5D] hover:underline text-sm font-medium"
          >
            Edit Cart
          </Link>
        </div>
      </div>
    </div>
  );
}