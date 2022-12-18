/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cx } from 'class-variance-authority';
import { useRouter } from 'next/router';

import { MENUS, RolesType } from '@/constants/role';
import { PROFILES } from '@/constants/pages';

export const Sidebar: React.FC = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <div className="sticky top-0 flex h-full w-72 flex-shrink-0 flex-col justify-between self-start border-r bg-white">
      <div className="px-4 py-6">
        <span className="block h-10 w-32 rounded-lg bg-gray-200"></span>

        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          {MENUS[data?.user.role as RolesType]?.map((menu, index) => (
            <Link
              key={index + 'menu'}
              href={menu.path}
              className={cx(
                'flex items-center rounded-lg px-4 py-2  hover:bg-gray-100 hover:text-gray-900',
                router.pathname === menu.path
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600'
              )}
            >
              <menu.icon className="text-xl" />
              <span className="ml-3 font-medium">{menu.display_name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <Link
          href={PROFILES}
          className="flex shrink-0 items-center bg-white p-4 hover:bg-gray-50"
        >
          <img
            alt="Man"
            src={data?.user.image || ''}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div className="ml-1.5">
            <p className="text-xs">
              <strong className="block font-medium">{data?.user.name}</strong>
              <span>{data?.user.email}</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
