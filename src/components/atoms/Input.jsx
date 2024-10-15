const Input = ({ placeholder, value, onChange, autoCapitalize = 'none' }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Apply capitalization logic based on autoCapitalize prop
    let newValue = inputValue;

    if (autoCapitalize === 'words') {
      // Capitalize each word
      newValue = inputValue.replace(/\b\w/g, (char) => char.toUpperCase());
    } else if (autoCapitalize === 'sentences') {
      // Capitalize the first letter of each sentence
      newValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    }

    // Pass the transformed value to the onChange handler
    onChange({ target: { value: newValue } });
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      autoCapitalize={autoCapitalize}
      className="p-2 w-full max-w-xs border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
    />
  );
};

export default Input;
