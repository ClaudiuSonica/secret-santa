import React from 'react';
import Snowflake from '../atoms/Snowflake';

const Snowfall = () => {
  // Generate random positions for each snowflake
  const snowflakes = Array.from({ length: 100 }).map((_, index) => {
    const randomLeft = Math.random() * 100; // Random left position from 0 to 100%
    const randomDelay = Math.random() * 5; // Random animation delay
    const randomDuration = 10 + Math.random() * 5; // Random animation duration between 10-15s
    const size = 20 + Math.random() * 12; // Random size between 8px and 20px

    return (
      <Snowflake
        key={index}
        style={{
          left: `${randomLeft}%`,
          animationDelay: `${randomDelay}s`,
          animationDuration: `${randomDuration}s`,
          width: `${size}px`,
          height: `${size}px`,
          top: '-20px',
        }}
      />
    );
  });

  return <div className="absolute inset-0 overflow-hidden">{snowflakes}</div>;
};

export default Snowfall;
