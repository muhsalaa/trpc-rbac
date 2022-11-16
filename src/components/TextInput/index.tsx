import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type TextInputAttributes = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const TextInput: React.FC<TextInputAttributes> = ({
  className,
  invalid,
  ...props
}) => {
  return (
    <input
      className={clsx(
        'form-input w-full rounded-md border-gray-200 shadow-sm sm:text-sm',
        invalid &&
          'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  );
};
