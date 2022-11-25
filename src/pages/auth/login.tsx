import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { FormControl } from '@/components/atoms/FormControl';
import { TextInput } from '@/components/atoms/TextInput';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';
import { Alert } from '@/components/atoms/Alert';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { pageAuth } from '@/utils/pageAuth';
import { getBaseUrl, trpc } from '@/utils/trpc';
import { LoginUserInput, loginUserSchema } from '@/schema/user.schema';
import { HOME } from '@/constants/pages';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { mutateAsync, isError, error } = trpc.user.loginUser.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const handleLogin: SubmitHandler<LoginUserInput> = async ({ email }) => {
    // guard html modification via devtools
    if (isLoading) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const user = await mutateAsync({ email });
      if (user) {
        const result = await signIn('email', {
          email,
          redirect: false,
          callbackUrl: getBaseUrl() + HOME,
        });

        setSuccess(Boolean(result?.ok));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex h-full w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm rounded-md border p-4 shadow-md">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          {isError && <ErrorAlert errors={error} className="mb-2" />}
          {isLoading && <Spinner />}
          {isSuccess && (
            <Alert className="mb-2" color="success">
              Berhasil, kami telah mengirim login link ke emailmu.
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleLogin)}>
            <FormControl>
              <Label htmlFor="email">Email</Label>
              <TextInput
                invalid={Boolean(errors.email)}
                id="email"
                placeholder="john@example.com"
                {...register('email')}
              />
              {errors.email?.message && (
                <FieldInfo type="error">{errors.email.message}</FieldInfo>
              )}
            </FormControl>
            <Button type="submit" block className="mt-4" disabled={isLoading}>
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden h-full bg-gradient-to-t from-green-300 via-blue-500 to-purple-600 lg:block lg:w-1/2"></div>
    </div>
  );
}

export const getServerSideProps = pageAuth();
