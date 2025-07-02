const CorporateForm = ({ formData, onChange, onSubmit, isAuthenticated, isSubmittingDisabled, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        {isAuthenticated ? (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        ) : (
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
          />
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message *</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#E30B5D] focus:border-[#E30B5D]"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmittingDisabled}
        className={`w-full bg-[#E30B5D] hover:bg-[#C90A53] text-white py-3 px-4 rounded-md font-medium transition-colors ${isSubmittingDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
};

export default CorporateForm;