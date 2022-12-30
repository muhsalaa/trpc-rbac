import { useEffect } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { RadioButton } from '@/components/molecules/RadioButton';
import { TextInput } from '@/components/atoms/TextInput';
import { FormControl } from '@/components/atoms/FormControl';
import { Label } from '@/components/atoms/Label';

import { EditUserInput, editUserSchema } from '@/schema/user.schema';
import { ROLES_OPTIONS } from '@/constants/role';
import { USER_STATUS_OPTIONS } from '@/constants/user';
import { Status } from '@prisma/client';

interface EditUserModalProps {
  userData?: EditUserInput;
  submitEditHandler: SubmitHandler<EditUserInput>;
  open: boolean;
  close: () => void;
}

export const EditUserModal = ({
  userData,
  submitEditHandler,
  open,
  close,
}: EditUserModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    reset({
      name: userData?.name,
      email: userData?.email,
      status: userData?.status,
      role: userData?.role,
    });
  }, [userData]);

  return (
    <Modal open={open} close={close} size="small" withCloseButton>
      <h3 className="mb-1 text-xl font-bold">Edit User</h3>
      <p className="mb-4 text-neutral-600">
        Change the user data in the form below
      </p>
      <form onSubmit={handleSubmit(submitEditHandler)}>
        <FormControl>
          <Label htmlFor="name">Name</Label>
          <TextInput
            id="name"
            disabled
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
            placeholder="doe@gmail.com"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email?.message && (
            <FieldInfo type="error">{errors.email.message}</FieldInfo>
          )}
        </FormControl>
        <FormControl>
          <Label as="span">Role</Label>
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <RadioButton
                setSelectedValue={onChange}
                selectedValue={value}
                options={ROLES_OPTIONS}
                name="role"
              />
            )}
          />
          {errors.role?.message && (
            <FieldInfo type="error">{errors.role.message}</FieldInfo>
          )}
        </FormControl>
        <FormControl>
          <Label as="span">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <RadioButton
                setSelectedValue={onChange}
                selectedValue={value}
                options={
                  userData?.status === Status.NEW
                    ? USER_STATUS_OPTIONS.concat({
                        value: 'NEW',
                        display: 'NEW',
                      })
                    : USER_STATUS_OPTIONS
                }
                name="status"
              />
            )}
          />
          {errors.status?.message && (
            <FieldInfo type="error">{errors.status.message}</FieldInfo>
          )}
        </FormControl>
        <Button className="ml-auto mt-8" type="submit">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
