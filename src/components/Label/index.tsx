import { LabelHTMLAttributes } from "react";
import clsx from "clsx";

type LabelAttributes = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label: React.FC<LabelAttributes> = ({
  className,
  required,
  ...props
}) => {
  return (
    <label
      className={clsx(
        "mb-1 block text-sm font-medium text-gray-700",
        required && "after:text-red-700 after:content-['*']",
        className
      )}
      {...props}
    />
  );
};
