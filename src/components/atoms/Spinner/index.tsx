import React, { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cSpinner = cva(
  ['inline-block', 'animate-spin', 'rounded-full', 'border-t-transparent'],
  {
    variants: {
      color: {
        primary: 'border-indigo-600',
        white: 'border-white',
        disabled: 'border-neutral-300',
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      thick: {
        1: 'border',
        2: 'border-2',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'md',
      thick: 2,
    },
  }
);

type SpinnerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cSpinner> & {};

export const Spinner: React.FC<SpinnerProps> = ({
  color,
  thick,
  size,
  ...props
}) => {
  return (
    <div
      className={cSpinner({
        color,
        thick,
        size,
      })}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
