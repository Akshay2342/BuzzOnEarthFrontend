import React from 'react';
import copyIcon from './CP.svg';
import copiedIcon from './cp1.svg';



import { useState } from 'react';

const ListItem = ({ item, index }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (item) => {
    navigator.clipboard.writeText("station " + item.ind);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset copied state after 2 seconds
  };


  const displayText = item.name || "station " + item.ind;

  return (
    <li key={index} className="p-1 border-b flex justify-between items-center">
      <span>{displayText}</span>
      <img
            src={isCopied ? copiedIcon : copyIcon}
            alt={isCopied ? 'Copied' : 'Copy'}
            className="ml-2 cursor-pointer"
            onClick={()=>handleCopy(item)}
            width={25}  
          />
    </li>
  );
};

export default ListItem;