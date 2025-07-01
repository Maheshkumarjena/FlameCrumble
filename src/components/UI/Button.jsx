'use client';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  ...props 
}) => {
  const baseClasses = 'rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center';
  
  const sizeClasses = {
    small: 'px-4 py-1.5 text-sm',
    medium: 'px-6 py-2.5 text-base',
    large: 'px-8 py-3.5 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-[#E30B5D] hover:bg-[#C90A53] text-white focus:ring-[#E30B5D] shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-gray-50 border-2 border-black text-black focus:ring-black',
    dark: 'bg-black hover:bg-gray-800 text-white focus:ring-black shadow-sm hover:shadow-md',
    outline: 'bg-transparent hover:bg-[#E30B5D]/10 border-2 border-[#E30B5D] text-[#E30B5D] focus:ring-[#E30B5D]',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-gray-300',
  };

  const iconSize = {
    small: 16,
    medium: 18,
    large: 20,
  };

  return (
    <button
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className={`animate-spin -ml-1 mr-3 h-4 w-4 ${iconPosition === 'right' ? 'order-2 ml-3 -mr-1' : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={iconSize[size]} className="mr-2" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon size={iconSize[size]} className="ml-2" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;