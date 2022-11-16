import { unstable_getServerSession as getServerSession } from 'next-auth';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PAGE_AUTH } from '@/constants/role';
import { GetServerSidePropsContext } from 'next';

export const pageAuth = (callback?: (ctx: GetServerSidePropsContext) => {}) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    const { role } = session.user;
    if (!PAGE_AUTH[role].includes(ctx.resolvedUrl)) {
      return {
        notFound: true,
      };
    }

    return callback ? callback(ctx) : { props: { session } };
  };
};
