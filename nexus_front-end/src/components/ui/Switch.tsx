import React from 'react';
import { Switch as NextUISwitch } from "@nextui-org/react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, size = "md" }) => {
  return (
    <NextUISwitch
      isSelected={checked}
      onValueChange={onCheckedChange}
      size={size}
      color="success"
    />
  );
};
