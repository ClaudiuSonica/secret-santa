const Button = ({ children, onClick, className = '' }) => {
  return (
    <button
      className={`bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
