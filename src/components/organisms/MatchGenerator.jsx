import React from 'react';
import Button from '../atoms/Button';

const MatchGenerator = ({ participants, onGenerateMatches }) => {
  return (
    <>
      {participants.length >= 3 && (
        <Button className="mt-4 bg-green-400 hover:bg-green-600 text-gray-700" onClick={onGenerateMatches}> {/* Adjusted to mt-4 for better spacing */}
          Generate Matches
        </Button>
      )}
    </>
  );
};

export default MatchGenerator;
