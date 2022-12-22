import { HOME, MANAGE_USER, PROFILES, SETTINGS } from './pages';

import { FiHome, FiUser, FiSettings, FiUsers } from 'react-icons/fi';

export const ROLES = {
  ADMIN: 'ADMIN',
  MAINTAINER: 'MAINTAINER',
  USER: 'USER',
};

export const ROLES_OPTIONS = [
  { value: 'USER', display: 'USER' },
  { value: 'MAINTAINER', display: 'MAINTAINER' },
  { value: 'ADMIN', display: 'ADMIN' },
];

export const PAGE_AUTH = {
  [ROLES.USER]: [HOME, PROFILES],
  [ROLES.MAINTAINER]: [HOME, MANAGE_USER, PROFILES],
  [ROLES.ADMIN]: [HOME, MANAGE_USER, PROFILES, SETTINGS],
};

export const MENUS = {
  [ROLES.USER]: [
    { icon: FiHome, path: HOME, display_name: 'Beranda' },
    { icon: FiUser, path: PROFILES, display_name: 'Profile' },
  ],
  [ROLES.MAINTAINER]: [
    { icon: FiHome, path: HOME, display_name: 'Beranda' },
    {
      icon: FiUsers,
      path: MANAGE_USER,
      display_name: 'Kelola Pengguna',
    },
    { icon: FiUser, path: PROFILES, display_name: 'Profile' },
  ],
  [ROLES.ADMIN]: [
    { icon: FiHome, path: HOME, display_name: 'Beranda' },
    {
      icon: FiUsers,
      path: MANAGE_USER,
      display_name: 'Kelola Pengguna',
    },
    { icon: FiUser, path: PROFILES, display_name: 'Profile' },
    { icon: FiSettings, path: SETTINGS, display_name: 'Pengaturan' },
  ],
};

export const ROLE_MANAGE = {
  [ROLES.ADMIN]: [ROLES.MAINTAINER, ROLES.USER],
  [ROLES.MAINTAINER]: [ROLES.USER],
  [ROLES.USER]: [],
};

export type RolesType = keyof typeof ROLES;
