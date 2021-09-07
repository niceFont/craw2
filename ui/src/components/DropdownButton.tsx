import React from 'react';
import {MdKeyboardArrowDown} from 'react-icons/md';
interface DropdownButtonProps {
  name : string
}


const DropdownButton = ({children, name} : React.PropsWithChildren<DropdownButtonProps>) => {
  const [open, toggleOpen] = React.useState(false);
  return (
    <div className="relative mr-2">
      <button
        onClick={() => toggleOpen(!open)}
        className="flex items-center border text-gray-700 border-gray-300 rounded-md py-2 px-4">
        <span className="mr-1">{name}</span>
        <MdKeyboardArrowDown size={18} className="mt-1"/>
      </button>
      {open && (
        <div className="absolute top-14 bg-white p-8 rounded-sm right-0 shadow-md">
          {children}
        </div>
      )}
    </div>
  );
};


export default DropdownButton;

