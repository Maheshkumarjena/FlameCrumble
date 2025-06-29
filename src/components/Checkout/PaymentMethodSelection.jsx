import React from 'react';

export default function PaymentMethodSelection({ paymentMethod, onInputChange }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={paymentMethod}
          onChange={onInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
          required
        >
          <option value="creditCard">Razorpay</option>
        </select>
        {paymentMethod === 'creditCard' && (
          <p className="mt-2 text-sm text-gray-500">
            *You will be redirected to a secure Razorpay popup to complete your payment, where you can choose from various options like cards, UPI, netbanking, etc.
          </p>
        )}
      </div>
    </div>
  );
}