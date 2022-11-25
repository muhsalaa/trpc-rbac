import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cAlert = cva(
  ['px-3', 'py-2', 'text-sm', 'rounded-md', 'border', 'border-opacity-20'],
  {
    variants: {
      color: {
        primary: ['bg-indigo-200', 'text-indigo-800', 'border-indigo-800'],
        warning: ['bg-orange-200', 'text-orange-800', 'border-orange-800'],
        success: ['bg-green-200', 'text-green-800', 'border-green-800'],
        error: ['bg-red-200', 'text-red-800', 'border-red-800'],
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  }
);

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cAlert> & {};

export const Alert: React.FC<AlertProps> = ({
  className,
  children,
  color,
  ...props
}) => {
  return (
    <div
      className={cAlert({
        color,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
