export const ROLES = {
  ADMIN: 'ADMIN',
  MAINTAINER: 'MAINTAINER',
  USER: 'USER',
};

export const PAGE_AUTH = {
  [ROLES.ADMIN]: ['/home', '/manage-user', '/profiles', '/settings'],
  [ROLES.MAINTAINER]: ['/home', '/manage-user', '/profiles'],
  [ROLES.USER]: ['/home', '/profiles'],
};
