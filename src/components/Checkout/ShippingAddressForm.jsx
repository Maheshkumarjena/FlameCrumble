import React, { useState, useEffect } from 'react';

export default function ShippingAddressForm({
  shippingInfo,
  onInputChange,
  savedAddresses,
  onSelectAddress,
}) {
  const [useNewAddress, setUseNewAddress] = useState(!shippingInfo.line1 && savedAddresses.length > 0);

  useEffect(() => {
    // If no address is pre-filled and there are saved addresses, default to using a new address
    if (!shippingInfo.line1 && savedAddresses.length > 0) {
      setUseNewAddress(true);
    }
  }, [shippingInfo.line1, savedAddresses]);

  const handleAddressSelectionChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === 'new') {
      setUseNewAddress(true);
      // Clear current shipping info fields when choosing a new address
      onSelectAddress({
        fullName: '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
        type: 'Home'
      });
    } else {
      setUseNewAddress(false);
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedId);
      if (selectedAddress) {
        onSelectAddress({
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || '',
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          country: selectedAddress.country || 'India',
          type: selectedAddress.type || 'Home'
        });
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

      {savedAddresses && savedAddresses.length > 0 && (
        <div className="mb-6">
          <label htmlFor="addressSelection" className="block text-sm font-medium text-gray-700 mb-1">
            Choose a Saved Address or Add New:
          </label>
          <select
            id="addressSelection"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
            onChange={handleAddressSelectionChange}
            value={useNewAddress ? 'new' : shippingInfo._id || ''}
          >
            <option value="">-- Select an address --</option>
            {savedAddresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.fullName}, {addr.line1}, {addr.city}
              </option>
            ))}
            <option value="new">Use a New Address</option>
          </select>
        </div>
      )}

      {(useNewAddress || savedAddresses.length === 0) && (
        <div className="space-y-6">
          {/* Address Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Address Type
            </label>
            <select
              id="type"
              name="type"
              value={shippingInfo.type}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              placeholder="(123) 456-7890"
              required
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="line1"
              name="line1"
              value={shippingInfo.line1}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              placeholder="123 Main St"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="line2"
              name="line2"
              value={shippingInfo.line2}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              placeholder="Apt 4B"
            />
          </div>

          {/* City, State, Zip Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                placeholder="Anytown"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                placeholder="CA"
                required
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={shippingInfo.zip}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                placeholder="90210"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={shippingInfo.country}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              required
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}