const CorporateForm = ({
  formData,
  onChange,
  onSubmit,
  isAuthenticated,
  authUser,
  isSubmittingDisabled,
  loading
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        {isAuthenticated ? (
          <div className="flex items-center">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <span className="ml-2 text-green-600" title="Verified email">
              ✓
            </span>
          </div>
        ) : (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          placeholder="Tell us about your requirements"
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#E30B5D] focus:border-[#E30B5D]"
          required
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-[#E30B5D] hover:bg-[#c5094f] text-white py-2 px-4 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30B5D]"
      >
        Submit Inquiry
      </button>
    </form>
  );
};

export default CorporateForm;