import { HTMLAttributes } from 'react';
import { cx } from 'class-variance-authority';

type FormControlAttributes = HTMLAttributes<HTMLDivElement>;

export const FormControl: React.FC<FormControlAttributes> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cx('mb-2', className)} {...props}>
      {children}
    </div>
  );
};
