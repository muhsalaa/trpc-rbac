import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/atoms/Button';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';
import { Modal } from '@/components/molecules/Modal';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { TextInput } from '@/components/atoms/TextInput';
import { FormControl } from '@/components/atoms/FormControl';
import { Label } from '@/components/atoms/Label';

import { CreateUserInput, createUserSchema } from '@/schema/user.schema';
import { signIn } from 'next-auth/react';
import { getBaseUrl, trpc } from '@/utils/trpc';
import { HOME } from '@/constants/pages';

interface CreateUserModalProps {
  onSuccess: () => void;
  open: boolean;
  close: () => void;
}

export const CreateUserModal = ({
  onSuccess,
  open,
  close,
}: CreateUserModalProps) => {
  const [isLoading, setLoading] = useState(false);

  const {
    mutateAsync,
    reset: resetError,
    isError,
    error,
  } = trpc.user.registerUser.useMutation();

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
        closeModal();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const closeModal = () => {
    if (isLoading) return;
    resetError();
    reset();
    close();
  };

  return (
    <Modal open={open} close={closeModal} size="small" withCloseButton>
      <h3 className="mb-1 text-xl font-bold">Create User</h3>
      <p className="mb-2 text-neutral-600">
        Input the new user data in the form below
      </p>
      {isError && <ErrorAlert errors={error} className="mb-4" />}
      <form onSubmit={handleSubmit(handleRegister)}>
        <FormControl>
          <Label htmlFor="name">Name</Label>
          <TextInput
            id="name"
            placeholder="John Doe"
            invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name?.message && (
            <FieldInfo type="error">{errors.name.message}</FieldInfo>
          )}
        </FormControl>
        <FormControl>
          <Label htmlFor="name">Email</Label>
          <TextInput
            id="email"
            placeholder="John Doe"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email?.message && (
            <FieldInfo type="error">{errors.email.message}</FieldInfo>
          )}
        </FormControl>
        <Button
          className="ml-auto mt-8"
          type="submit"
          disabled={isLoading}
          activated={isLoading}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};
