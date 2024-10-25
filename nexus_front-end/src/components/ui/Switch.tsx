import React from 'react';

interface SwitchProps {
  name?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  [key: string]: any;
}

export const Switch: React.FC<SwitchProps> = ({ name, checked, onCheckedChange, ...props }) => {
  return (
    <label className="relative inline-block w-10 h-6">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="opacity-0 w-0 h-0"
        {...props}
      />
      <span
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 transition rounded-full ${checked ? 'bg-green-500' : 'bg-red-500'}`}
      >
        <span
          className={`absolute h-4 w-4 left-1 bottom-1 bg-white transition rounded-full ${checked ? 'transform translate-x-4' : ''}`}
        ></span>
      </span>
    </label>
  );
};