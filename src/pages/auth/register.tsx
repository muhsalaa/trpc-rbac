import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { FormControl } from '@/components/atoms/FormControl';
import { TextInput } from '@/components/atoms/TextInput';
import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/atoms/Alert';
import { Label } from '@/components/atoms/Label';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';
import { pageAuth } from '@/utils/pageAuth';
import { getBaseUrl, trpc } from '@/utils/trpc';
import { CreateUserInput, createUserSchema } from '@/schema/user.schema';
import { HOME } from '@/constants/pages';
import { Spinner } from '@/components/atoms/Spinner';

export default function Register() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { mutateAsync, isError, error } = trpc.user.registerUser.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const handleRegister: SubmitHandler<CreateUserInput> = async ({
    email,
    name,
  }) => {
    // guard html modification via devtools
    if (isLoading) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const user = await mutateAsync({ email, name });
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
          <h1 className="mb-2 text-lg font-medium">Register</h1>
          {isError && <ErrorAlert errors={error} className="mb-2" />}
          {isLoading && <Spinner />}
          {isSuccess && (
            <Alert className="mb-2" color="success">
              Pendaftaran berhasil. Silahkan cek email untuk verifikasi
            </Alert>
          )}

          <form onSubmit={handleSubmit(handleRegister)}>
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
            <FormControl>
              <Label htmlFor="name">Name</Label>
              <TextInput
                invalid={Boolean(errors.name)}
                id="name"
                placeholder="John Doe"
                {...register('name')}
              />
              {errors.name?.message && (
                <FieldInfo type="error">{errors.name.message}</FieldInfo>
              )}
            </FormControl>
            <Button type="submit" block className="mt-4" disabled={isLoading}>
              Register
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden h-full bg-gradient-to-t from-green-300 via-blue-500 to-purple-600 lg:block lg:w-1/2"></div>
    </div>
  );
}

export const getServerSideProps = pageAuth();
