import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cButton = cva(
  [
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
        warning: ['bg-amber-600', 'hover:bg-amber-700', 'text-white'],
        error: ['bg-red-600', 'hover:bg-red-700', 'text-white'],
        success: ['bg-emerald-600', 'hover:bg-emerald-700', 'text-white'],
        disabled: ['bg-neutral-400', 'text-neutral-100', 'cursor-not-allowed'],
      },
      block: {
        true: 'w-full block',
      },
      shape: {
        default: ['px-8', 'py-3'],
        square: ['p-2'],
      },
    },
    defaultVariants: {
      color: 'primary',
      block: false,
      shape: 'default',
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
  shape,
  ...props
}) => {
  return (
    <button
      disabled={Boolean(disabled)}
      className={cButton({
        color: disabled ? 'disabled' : color,
        block,
        shape,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
