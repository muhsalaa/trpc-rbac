import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormControl } from '@/components/atoms/FormControl';
import { TextInput } from '@/components/atoms/TextInput';
import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/atoms/Alert';
import { Label } from '@/components/atoms/Label';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';
import { Card } from '@/components/atoms/Card';
import { AuthLayout } from '@/components/layout/Auth';
import { Spinner } from '@/components/atoms/Spinner';

import { pageAuth } from '@/utils/pageAuth';
import { useCreateUser } from '@/hooks/useCreateUser';
import { CreateUserInput, createUserSchema } from '@/schema/user.schema';
import { NextPageWithLayout } from '@/types/page';

const Register: NextPageWithLayout = () => {
  const [isSuccess, setSuccess] = useState(false);

  const { handleRegister, isLoading, error, isError } = useCreateUser({
    onSuccess: () => setSuccess(true),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  return (
    <Card size="small">
      <h1 className="mb-2 text-lg font-medium">Register</h1>
      {isError && <ErrorAlert errors={error!} className="mb-2" />}
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
    </Card>
  );
};

Register.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Register;

export const getServerSideProps = pageAuth();
