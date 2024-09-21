import React from 'react';

const ListItem = ({ item, index }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const displayText = item.name || "station " + item.ind;

  return (
    <li key={index} className="p-1 border-b flex justify-between items-center">
      <span>{displayText}</span>
      <button
        onClick={() => handleCopy(displayText)}
        className="ml-2 p-1 bg-blue-500 text-white rounded"
      >
        Copy
      </button>
    </li>
  );
};

export default ListItem;