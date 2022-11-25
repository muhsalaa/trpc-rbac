import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cButton = cva(
  [
    'px-8',
    'py-3',
    'inline-block',
    'text-sm',
    'font-medium',
    'rounded-md',
    'flex',
    'justify-center',
  ],
  {
    variants: {
      color: {
        primary: ['bg-indigo-600', 'hover:bg-indigo-700', 'text-white'],
        warning: ['bg-orange-600', 'hover:bg-orange-700', 'text-white'],
        success: ['bg-green-600', 'hover:bg-green-700', 'text-white'],
        disabled: ['bg-neutral-400', 'text-neutral-100'],
      },
      block: {
        true: 'w-full block',
      },
    },
    defaultVariants: {
      color: 'primary',
      block: false,
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof cButton> & {};

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  color,
  block,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={Boolean(disabled)}
      className={cButton({
        color: disabled ? 'disabled' : color,
        block,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
