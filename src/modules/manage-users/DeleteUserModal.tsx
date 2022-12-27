import { Alert } from '@/components/atoms/Alert';
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';

import { RouterOutput } from '@/server/trpc/router/_app';
import { trpc } from '@/utils/trpc';
import { useEffect } from 'react';

type UserData = RouterOutput['user']['getMe'];

interface DeleteUserModalProps {
  open: boolean;
  close: () => void;
  onSuccess: () => void;
  userData?: UserData;
}

export const DeleteUserModal = ({
  open,
  close,
  userData,
  onSuccess,
}: DeleteUserModalProps) => {
  const { mutate, isLoading, isSuccess } = trpc.user.deleteUser.useMutation();

  const closeModal = () => {
    if (isLoading) return;
    close();
  };

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      close();
    }
  }, [isSuccess]);

  return (
    <Modal open={open} close={closeModal} size="small">
      <h3 className="mb-1 text-xl font-bold">Delete User</h3>
      <p className="mb-4 text-neutral-600">
        Are you sure you want to delete this user? This action can&apos;t be
        undone!
      </p>
      <Alert color="neutral">
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>: {userData?.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>: {userData?.email}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>: {userData?.role}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>: {userData?.status}</td>
            </tr>
          </tbody>
        </table>
      </Alert>

      <div className="mt-8 flex gap-2">
        <Button
          color="error"
          block
          disabled={isLoading}
          activated={isLoading}
          onClick={() => mutate({ id: userData?.id! })}
        >
          Yes
        </Button>
        <Button
          block
          onClick={closeModal}
          disabled={isLoading}
          activated={isLoading}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
