import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { FormControl } from '@/components/FormControl';
import { TextInput } from '@/components/TextInput';
import { Label } from '@/components/Label';
import { FieldInfo } from '@/components/FieldInfo';
import { pageAuth } from '@/utils/pageAuth';
import { getBaseUrl, trpc } from '@/utils/trpc';
import { LoginUserInput, loginUserSchema } from '@/schema/user.schema';
import { HOME } from '@/constants/pages';

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
    setLoading(true);

    try {
      const user = await mutateAsync({ email });
      if (user) {
        const result = await signIn('email', {
          email,
          redirect: false,
          callbackUrl: getBaseUrl() + HOME,
        });
        console.log(result);

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
          {isError && (
            <p className="mb-2 text-red-500">
              {error.data?.zodError ? 'something bad happened' : error.message}
            </p>
          )}
          {isLoading && <p className="mb-2 text-gray-500">Loding...</p>}
          {isSuccess && (
            <p className="mb-2 text-green-500">
              Berhasil, kami telah mengirim login link ke emailmu.
            </p>
          )}

          <form onSubmit={handleSubmit(handleLogin)}>
            <FormControl>
              <Label htmlFor="email">Email</Label>
              <TextInput
                invalid={Boolean(errors.email)}
                id="email"
                placeholder="john@gmaic.com"
                {...register('email')}
              />
              {errors.email?.message && (
                <FieldInfo type="error">{errors.email.message}</FieldInfo>
              )}
            </FormControl>
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-blue-400 p-2 text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="hidden h-full bg-black lg:block lg:w-1/2"></div>
    </div>
  );
}

export const getServerSideProps = pageAuth();
