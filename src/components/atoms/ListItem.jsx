import React from 'react';
import Button from './Button';
import { FaTrash } from 'react-icons/fa';

const ListItem = ({ name, email, onRemove }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-lg shadow-md hover:bg-gray-800/50 transition-colors duration-200">
      {/* Avatar and name/email section */}
      <div className="flex items-start space-x-3 sm:space-x-6 md:space-x-3">  {/* Reduced space for tighter design */}
        <div className="bg-gray-700 rounded-full h-10 w-10 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">{name.charAt(0)}</span>  {/* First letter of the name */}
        </div>
        <div className="leading-tight">  {/* Aligns name and email better */}
          <p className="text-white font-medium">{name}</p>
          <p className="text-gray-400 text-xs">{email}</p>
        </div>
      </div>
      
      {/* Remove button */}
      <Button
        className="flex items-center justify-center px-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300 ml-4"
        onClick={onRemove}
      >
        <FaTrash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ListItem;
