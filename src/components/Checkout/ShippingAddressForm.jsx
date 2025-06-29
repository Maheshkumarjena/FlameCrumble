import React, { useState, useEffect } from 'react';

export default function ShippingAddressForm({
  shippingInfo,
  onInputChange,
  savedAddresses,
  onSelectAddress,
}) {
  const [useNewAddress, setUseNewAddress] = useState(!shippingInfo.address && savedAddresses.length > 0);

  useEffect(() => {
    // If no address is pre-filled and there are saved addresses, default to using a new address
    if (!shippingInfo.address && savedAddresses.length > 0) {
      setUseNewAddress(true);
    }
  }, [shippingInfo.address, savedAddresses]);

  const handleAddressSelectionChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === 'new') {
      setUseNewAddress(true);
      // Clear current shipping info fields when choosing a new address
      onSelectAddress({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      });
    } else {
      setUseNewAddress(false);
      const selectedAddress = savedAddresses.find(addr => addr._id === selectedId);
      if (selectedAddress) {
        onSelectAddress({
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          phone: selectedAddress.phone,
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
            value={useNewAddress ? 'new' : shippingInfo.address ? shippingInfo._id || '' : ''} // This might need refinement based on how you uniquely identify selected addresses if not directly from savedAddresses
          >
            <option value="">-- Select an address --</option>
            {savedAddresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.fullName}, {addr.address}, {addr.city}
              </option>
            ))}
            <option value="new">Use a New Address</option>
          </select>
        </div>
      )}

      {(useNewAddress || savedAddresses.length === 0) && (
        <div className="space-y-6">
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
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={onInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
              placeholder="123 Main St"
              required
            />
          </div>
          {/* City, State/Province, Zip Code */}
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
                State / Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={onInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
                placeholder="CA"
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
        </div>
      )}
    </div>
  );
}