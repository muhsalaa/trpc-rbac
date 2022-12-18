import { HTMLAttributes } from 'react';
import { cx } from 'class-variance-authority';
import { Card, type CardVariants } from '@/components/atoms/Card';
import { HiXMark } from 'react-icons/hi2';

export type ModalProps = HTMLAttributes<HTMLDivElement> & {
  size?: CardVariants['size'];
  open: boolean;
  withCloseButton?: boolean;
  close: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  className,
  children,
  size = 'default',
  open,
  withCloseButton,
  close,
  ...props
}) => {
  return (
    <div
      className={cx(
        'fixed inset-0 z-10',
        open ? 'pointer-events-auto' : 'pointer-events-none',
        className
      )}
      {...props}
    >
      {/* overlay */}
      <div
        className={cx(
          'absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
          open
            ? 'opacity-100 duration-300 ease-out'
            : 'opacity-0  duration-150 ease-in '
        )}
        onClick={close}
      />
      <div className="flex h-full w-full items-end justify-center p-4 sm:items-center sm:p-0">
        <Card
          className={
            open
              ? 'translate-y-0 opacity-100 duration-200 ease-in sm:scale-100'
              : 'translate-y-4 opacity-0 duration-300 ease-out  sm:translate-y-0 sm:scale-95'
          }
          size={size}
        >
          {withCloseButton && (
            <div className="flex w-full">
              <button className="ml-auto" onClick={close}>
                <HiXMark className="text-2xl" />
              </button>
            </div>
          )}
          {children}
        </Card>
      </div>
    </div>
  );
};
