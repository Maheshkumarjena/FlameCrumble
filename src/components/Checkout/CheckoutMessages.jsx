import React from 'react';

export default function CheckoutMessages({ successMessage, errorMessage, cartError, authError }) {
  return (
    <>
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}
      {cartError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
          <p>Cart Error: {cartError}</p>
        </div>
      )}
      {authError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
          <p>Authentication Error: {authError}</p>
        </div>
      )}
    </>
  );
}