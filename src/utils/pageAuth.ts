import { unstable_getServerSession as getServerSession } from 'next-auth';

import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PAGE_AUTH } from '@/constants/role';
import { GetServerSidePropsContext } from 'next';
import { HOME, LOGIN, REGISTER } from '@/constants/pages';

export const pageAuth = (callback?: (ctx: GetServerSidePropsContext) => {}) => {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const publicPages = [LOGIN, REGISTER];
    const isPublicPages = publicPages.includes(ctx.resolvedUrl);

    // check if user has NO session, and is going to protected page
    // action -> redirect to LOGIN
    if (!session && !isPublicPages) {
      return {
        redirect: {
          destination: LOGIN,
          permanent: false,
        },
      };
    }

    // check if user has session, and is going to public page
    // action -> redirect to HOME
    if (session && isPublicPages) {
      return {
        redirect: {
          destination: HOME,
          permanent: false,
        },
      };
    }

    // check if user has session, but their role doesn match page to visit
    // action -> redirect to 404
    if (session && !PAGE_AUTH[session.user.role].includes(ctx.resolvedUrl)) {
      return {
        notFound: true,
      };
    }

    return callback ? callback(ctx) : { props: { session } };
  };
};
