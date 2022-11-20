import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'form-input w-full rounded-md border-gray-200 shadow-sm sm:text-sm',
          invalid &&
            'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
