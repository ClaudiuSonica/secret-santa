import React from 'react';

const Heading = ({ text }) => {
  return (
    <h1 className="text-5xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
      {text}
    </h1>
  );
};

export default Heading;
