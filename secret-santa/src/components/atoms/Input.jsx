const Input = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 w-full max-w-xs border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
    />
  );
};

export default Input;
