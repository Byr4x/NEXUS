import React from 'react';
import { TextField, Button as MuiButton, ButtonProps } from '@mui/material';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof TextField>>((props, ref) => (
  <TextField
    variant="outlined"
    fullWidth
    inputRef={ref}
    {...props}
  />
));

Input.displayName = 'Input';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <MuiButton
    variant="contained"
    ref={ref}
    {...props}
  />
));

Button.displayName = 'Button';