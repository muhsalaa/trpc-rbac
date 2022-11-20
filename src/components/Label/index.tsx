import { LabelHTMLAttributes } from 'react';
import clsx from 'clsx';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label: React.FC<LabelProps> = ({
  className,
  required,
  ...props
}) => {
  return (
    <label
      className={clsx(
        'mb-1 block text-sm font-medium text-gray-700',
        required && "after:text-red-700 after:content-['*']",
        className
      )}
      {...props}
    />
  );
};
