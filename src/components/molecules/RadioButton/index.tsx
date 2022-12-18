import { cx } from 'class-variance-authority';

import { Dispatch } from 'react';
import { HiCheckCircle } from 'react-icons/hi2';

export type RadioButtonProps<C = string | undefined> = {
  selectedValue: C;
  setSelectedValue: Dispatch<C>;
  name: string;
  options: {
    value: string;
    display: string;
  }[];
  className?: string;
};

export const RadioButton = <C = string | undefined,>({
  setSelectedValue,
  selectedValue,
  options,
  className,
  name,
}: RadioButtonProps<C>) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value as C);
  };

  return (
    <div
      className={cx('relative flex items-center gap-2', className)}
      role="radiogroup"
    >
      {options.map((item) => (
        <div
          className="w-full"
          key={item.value}
          tabIndex={0}
          role="radio"
          aria-checked={selectedValue === item.value}
        >
          <input
            type="radio"
            name={name}
            value={item.value}
            id={item.value}
            className="peer hidden [&:checked_+_label_svg]:block"
            onChange={handleChange}
            checked={selectedValue === item.value}
          />
          <label
            htmlFor={item.value}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white py-2 px-3 text-gray-900 hover:border-gray-300 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white"
          >
            <HiCheckCircle className="hidden h-5 w-5" />
            <p className="text-sm font-medium">{item.display}</p>
          </label>
        </div>
      ))}
    </div>
  );
};
