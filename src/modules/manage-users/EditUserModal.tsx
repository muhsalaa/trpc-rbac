import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { RadioButton } from '@/components/molecules/RadioButton';
import { TextInput } from '@/components/atoms/TextInput';
import { FormControl } from '@/components/atoms/FormControl';
import { Label } from '@/components/atoms/Label';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';

import { Status } from '@prisma/client';
import { trpc } from '@/utils/trpc';
import { EditUserInput, editUserSchema } from '@/schema/user.schema';
import { ROLES_OPTIONS } from '@/constants/role';
import { USER_STATUS_OPTIONS } from '@/constants/user';

interface EditUserModalProps {
  userData?: EditUserInput;
  onSuccess: () => void;
  open: boolean;
  close: () => void;
}

export const EditUserModal = ({
  userData,
  onSuccess,
  open,
  close,
}: EditUserModalProps) => {
  const [isLoading, setLoading] = useState(false);

  const {
    mutateAsync,
    reset: resetError,
    isError,
    error,
  } = trpc.user.editUser.useMutation();

  const handleEdit = async (data: EditUserInput) => {
    // guard html modification via devtools
    if (isLoading) {
      return;
    }

    setLoading(true);

    try {
      await mutateAsync(data);
      onSuccess();
      close();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (isLoading) return;
    resetError();
    close();
  };

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
      id: userData?.id,
    });
  }, [userData]);

  return (
    <Modal open={open} close={closeModal} size="small" withCloseButton>
      <h3 className="mb-1 text-xl font-bold">Edit User</h3>
      <p className="mb-4 text-neutral-600">
        Change the user data in the form below
      </p>
      {isError && <ErrorAlert errors={error} className="mb-4" />}
      <form onSubmit={handleSubmit(handleEdit)}>
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
