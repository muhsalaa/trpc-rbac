import { LabelHTMLAttributes } from 'react';
import { cx } from 'class-variance-authority';

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
      className={cx(
        'mb-1 block text-sm font-medium text-gray-700',
        required ? "after:text-red-700 after:content-['*']" : '',
        className
      )}
      {...props}
    />
  );
};
