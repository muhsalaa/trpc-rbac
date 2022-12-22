import { BadgeVariantsNonNull } from '@/components/atoms/Badge';

export const STATUS_COLOR: { [key: string]: BadgeVariantsNonNull } = {
  ACTIVE: 'success',
  WARNING: 'warning',
  BANNED: 'error',
  NEW: 'info',
};
