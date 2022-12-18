import { TableHTMLAttributes } from 'react';
import { cx } from 'class-variance-authority';

type TableProps = TableHTMLAttributes<HTMLTableElement>;
type TableSectionProps = TableHTMLAttributes<HTMLTableSectionElement>;
type TableElementProps = TableHTMLAttributes<HTMLTableCellElement>;
type TableHeadProps = TableHTMLAttributes<HTMLTableCellElement> & {
  isEmpty?: boolean;
};
type TableRowElementProps = TableHTMLAttributes<HTMLTableRowElement>;

export const Table: React.FC<TableProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
      <table
        className={cx('min-w-full divide-y divide-gray-200 text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const THead: React.FC<TableSectionProps> = ({ children, ...props }) => {
  return (
    <thead className="bg-gray-100" {...props}>
      {children}
    </thead>
  );
};

export const TH: React.FC<TableHeadProps> = ({
  children,
  isEmpty,
  ...props
}) => {
  return (
    <th
      className={
        isEmpty
          ? 'px-4 py-2'
          : 'whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900'
      }
      {...props}
    >
      {children}
    </th>
  );
};

export const TBody: React.FC<TableSectionProps> = ({ children, ...props }) => {
  return (
    <tbody className="divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  );
};

export const TR: React.FC<TableRowElementProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

export const TD: React.FC<TableElementProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td
      className={cx('whitespace-nowrap px-4 py-2 text-gray-700', className)}
      {...props}
    >
      {children}
    </td>
  );
};
