import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  const baseStyle = 'px-4 py-2 rounded font-semibold'
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  const classes = `${baseStyle} ${variantStyles[variant]} ${className || ''}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}