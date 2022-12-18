import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cCard = cva(
  [
    'p-4',
    'rounded-lg',
    'bg-white',
    'shadow-xl',
    'w-full',
    'border',
    'border-neutral-50',
  ],

  {
    variants: {
      size: {
        small: 'max-w-md',
        default: 'max-w-xl',
        big: 'max-w-3xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type CardVariants = VariantProps<typeof cCard>;
export type CardProps = HTMLAttributes<HTMLDivElement> & CardVariants;

export const Card: React.FC<CardProps> = ({
  className,
  children,
  size,
  ...props
}) => {
  return (
    <div
      className={cCard({
        size,
        className,
      })}
      {...props}
    >
      {children}
    </div>
  );
};
