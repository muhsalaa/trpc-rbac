import { HTMLAttributes } from "react";
import clsx from "clsx";

type FormControlAttributes = HTMLAttributes<HTMLDivElement>;

export const FormControl: React.FC<FormControlAttributes> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={clsx("mb-2 p-2", className)} {...props}>
      {children}
    </div>
  );
};
