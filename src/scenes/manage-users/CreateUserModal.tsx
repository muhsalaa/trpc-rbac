import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { TextInput } from '@/components/atoms/TextInput';
import { FormControl } from '@/components/atoms/FormControl';
import { Label } from '@/components/atoms/Label';

import { CreateUserInput, createUserSchema } from '@/schema/user.schema';

interface CreateUserModalProps {
  submitCrateUser: SubmitHandler<CreateUserInput>;
  open: boolean;
  close: () => void;
}

export const CreateUserModal = ({
  submitCrateUser,
  open,
  close,
}: CreateUserModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const closeModal = () => {
    reset();
    close();
  };

  return (
    <Modal open={open} close={closeModal} size="small">
      <h3 className="mb-1 text-xl font-bold">Create User</h3>
      <p className="mb-4 text-neutral-600">
        Input the new user data in the form below
      </p>
      <form onSubmit={handleSubmit(submitCrateUser)}>
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
        <Button className="ml-auto mt-8" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
