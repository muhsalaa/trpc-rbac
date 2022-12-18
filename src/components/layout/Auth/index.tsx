import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <div className="flex h-full w-full items-center justify-center p-8 lg:w-1/2">
        {children}
      </div>
      <div className="hidden h-full bg-gradient-to-t from-green-300 via-blue-500 to-purple-600 lg:block lg:w-1/2"></div>
    </div>
  );
};
