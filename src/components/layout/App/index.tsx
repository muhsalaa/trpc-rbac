import React from 'react';

import { Sidebar } from '@/components/organisms/Sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full overflow-y-auto">
      <Sidebar />
      <div className="h-full w-full min-w-0">{children}</div>
    </div>
  );
};
