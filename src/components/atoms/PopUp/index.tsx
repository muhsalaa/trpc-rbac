import { useEffect, useRef } from 'react';
import { cx } from 'class-variance-authority';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const VARIANT = {
  success: {
    icon: FiCheckCircle,
    color: 'text-emerald-700',
  },
  error: {
    icon: FiAlertCircle,
    color: 'text-red-700',
  },
};

interface PopUpProps {
  title: string;
  content: string;
  variant?: 'success' | 'error';
  show: boolean;
  close: () => void;
}

export const PopUp = ({
  title,
  content,
  variant = 'success',
  show,
  close,
}: PopUpProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const Icon = VARIANT[variant].icon;
  const color = VARIANT[variant].color;

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      close();
    }, 3000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [show]);

  const handlecloseButton = () => {
    close();
  };

  return (
    <div
      role="alert"
      className={cx(
        'fixed top-20 left-0 right-0 px-4 transition-all duration-300 ease-in-out',
        show
          ? 'opacity-1 pointer-events-auto top-20'
          : 'pointer-events-none top-4 opacity-0'
      )}
    >
      <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <div className="flex items-start gap-4">
          <Icon className={color + ' mt-0.5 text-xl'} />
          <div className="flex-1">
            <strong className="block font-medium text-gray-900">{title}</strong>
            <p className="mt-1 text-sm text-gray-700">{content}</p>
          </div>

          <button
            onClick={handlecloseButton}
            className="text-gray-500 transition hover:text-gray-600"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
