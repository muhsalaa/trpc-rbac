import { cx } from 'class-variance-authority';

type LabelProps<C extends React.ElementType> = {
  required?: boolean;
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

export const Label = <C extends React.ElementType = 'label'>({
  className,
  required,
  as,
  ...props
}: LabelProps<C>) => {
  const Component = as || 'label';

  return (
    <Component
      className={cx(
        'mb-1 block text-left text-sm font-medium text-gray-700',
        required ? "after:text-red-700 after:content-['*']" : '',
        className
      )}
      {...props}
    />
  );
};
