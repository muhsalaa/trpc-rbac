import { Alert } from '@/components/atoms/Alert';
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { RouterOutput } from '@/server/trpc/router/_app';

type UserData = RouterOutput['user']['getMe'];

interface DeleteUserModalProps {
  handleDeleteUser: (id?: string) => void;
  open: boolean;
  close: () => void;
  userData?: UserData;
}

export const DeleteUserModal = ({
  handleDeleteUser,
  open,
  close,
  userData,
}: DeleteUserModalProps) => {
  return (
    <Modal open={open} close={close} size="small">
      <h3 className="mb-1 text-xl font-bold">Delete User</h3>
      <p className="mb-4 text-neutral-600">
        Are you sure you want to delete this user? This action can't be undone!
      </p>
      <Alert color="neutral">
        <table>
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
        </table>
      </Alert>
      <div className="mt-8 flex gap-2">
        <Button
          color="error"
          block
          onClick={() => handleDeleteUser(userData?.id)}
        >
          Yes
        </Button>
        <Button block onClick={close}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
