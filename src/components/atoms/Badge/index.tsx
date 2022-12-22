import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cBadge = cva(
  [
    'px-2.5',
    'py-0.5',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'text-sm',
  ],
  {
    variants: {
      color: {
        warning: ['bg-amber-100', 'text-amber-700', 'border-amber-700'],
        success: ['bg-emerald-100', 'text-emerald-700', 'border-emerald-700'],
        error: ['bg-red-100', 'text-red-700', 'border-red-700'],
        info: ['bg-blue-100', 'text-blue-700', 'border-blue-700'],
      },
    },
    defaultVariants: {
      color: 'success',
    },
  }
);

type BadgeVariants = VariantProps<typeof cBadge>;
export type BadgeVariantsNonNull = Exclude<BadgeVariants['color'], null>;
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & BadgeVariants;

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  color,
  ...props
}) => {
  return (
    <span
      className={cBadge({
        color,
        className,
      })}
      {...props}
    >
      {children}
    </span>
  );
};
