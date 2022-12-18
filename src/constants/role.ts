import { HOME, MANAGE_USER, PROFILES, SETTINGS } from './pages';
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

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
    { icon: HiOutlineHome, path: HOME, display_name: 'Beranda' },
    { icon: HiOutlineUserCircle, path: PROFILES, display_name: 'Profile' },
  ],
  [ROLES.MAINTAINER]: [
    { icon: HiOutlineHome, path: HOME, display_name: 'Beranda' },
    {
      icon: HiOutlineUserGroup,
      path: MANAGE_USER,
      display_name: 'Kelola Pengguna',
    },
    { icon: HiOutlineUserCircle, path: PROFILES, display_name: 'Profile' },
  ],
  [ROLES.ADMIN]: [
    { icon: HiOutlineHome, path: HOME, display_name: 'Beranda' },
    {
      icon: HiOutlineUserGroup,
      path: MANAGE_USER,
      display_name: 'Kelola Pengguna',
    },
    { icon: HiOutlineUserCircle, path: PROFILES, display_name: 'Profile' },
    { icon: HiOutlineCog6Tooth, path: SETTINGS, display_name: 'Pengaturan' },
  ],
};

export const ROLE_MANAGE = {
  [ROLES.ADMIN]: [ROLES.MAINTAINER, ROLES.USER],
  [ROLES.MAINTAINER]: [ROLES.USER],
  [ROLES.USER]: [],
};

export type RolesType = keyof typeof ROLES;
