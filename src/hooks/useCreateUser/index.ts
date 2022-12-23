import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { getBaseUrl, trpc } from '@/utils/trpc';
import { HOME } from '@/constants/pages';
import { CreateUserInput } from '@/schema/user.schema';

export const useCreateUser = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setLoading] = useState(false);

  const { mutateAsync, ...restProps } = trpc.user.registerUser.useMutation();

  const handleRegister = async ({ email, name }: CreateUserInput) => {
    // guard html modification via devtools
    if (isLoading) {
      return;
    }

    setLoading(true);

    try {
      const user = await mutateAsync({ email, name });
      if (user) {
        signIn('email', {
          email,
          redirect: false,
          callbackUrl: getBaseUrl() + HOME,
        });

        onSuccess();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, ...restProps, isLoading };
};
