import { InputHTMLAttributes, forwardRef } from 'react';
import { cx } from 'class-variance-authority';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, invalid, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cx(
          'form-input w-full rounded-md border-gray-200 shadow-sm placeholder:text-neutral-300 sm:text-sm',
          invalid
            ? 'border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500'
            : '',
          disabled ? 'cursor-not-allowed bg-neutral-200 text-neutral-500 ' : '',
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';
