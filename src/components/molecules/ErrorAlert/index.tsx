import React from 'react';
import { Alert, type AlertProps } from '@/components/atoms/Alert';
import { TRPCClientErrorLike } from '@trpc/client';
import { AppRouter } from '@/server/trpc/router/_app';

export const ErrorAlert: React.FC<
  AlertProps & { errors: TRPCClientErrorLike<AppRouter> }
> = ({ className, errors, ...props }) => {
  const formatError = () => {
    const zodError = errors.data?.zodError;
    if (zodError) {
      const errorList = Object.values(zodError.fieldErrors);

      return (
        <>
          <p className="mb-1">Something is wrong!</p>
          <ul className="list-inside list-disc">
            {errorList.map((err, idx) => (
              <li key={idx + 'arb'}>{err}</li>
            ))}
          </ul>
        </>
      );
    }

    return errors.message;
  };

  return (
    <Alert className={className} color="error" {...props}>
      {formatError()}
    </Alert>
  );
};
