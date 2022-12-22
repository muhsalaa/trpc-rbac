import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiChevronUp, FiEdit3, FiTrash2, FiUserPlus } from 'react-icons/fi';

import { AppLayout } from '@/components/layout/App';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Table, THead, TR, TH, TBody, TD } from '@/components/atoms/Table';
import { EditUserModal } from '@/scenes/manage-users/EditUserModal';
import { CreateUserModal } from '@/scenes/manage-users/CreateUserModal';
import { DeleteUserModal } from '@/scenes/manage-users/DeleteUserModal';

import { pageAuth } from '@/utils/pageAuth';
import { trpc } from '@/utils/trpc';
import { checkManageUserAuthorization } from '@/utils/authorization';
import { RouterOutput } from '@/server/trpc/router/_app';
import { NextPageWithLayout } from '@/types/page';
import { CreateUserInput, EditUserInput } from '@/schema/user.schema';
import { STATUS_COLOR } from '@/constants/theme';

type UserOutput = RouterOutput['user']['getMe'];

const ManageUser: NextPageWithLayout = () => {
  const [isOpenModalEditUser, setOpenModalEditUser] = useState(false);
  const [isOpenModalCreateUser, setOpenModalCreateUser] = useState(false);
  const [isOpenModalDeleteUser, setOpenModalDeleteUser] = useState(false);
  const [userData, setUserData] = useState<UserOutput>();

  const { data: sessionData } = useSession();
  const { data } = trpc.user.getAllUser.useQuery();

  const openEditUserModal = (user: UserOutput) => {
    setUserData(user);
    setOpenModalEditUser(true);
  };

  const openDeleteUserModal = (user: UserOutput) => {
    setUserData(user);
    setOpenModalDeleteUser(true);
  };

  const handleEditUser = (values: EditUserInput) => {
    console.log(values);
  };

  const handleCreateUser = (values: CreateUserInput) => {
    console.log(values);
  };

  const handleDeleteUser = (id: string) => {
    console.log(id);
  };

  return (
    <div className="p-8">
      <h1 className="mb-10 text-4xl font-bold">Manage User</h1>
      <Table>
        <THead>
          <TR>
            <TH>
              <div className="flex items-center gap-2">
                ID <FiChevronUp />
              </div>
            </TH>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Role</TH>
            <TH>Status</TH>
            <TH>
              <Button
                shape="square"
                color="success"
                onClick={() => setOpenModalCreateUser(true)}
              >
                <FiUserPlus />
              </Button>
            </TH>
          </TR>
        </THead>
        <TBody>
          {data?.map((user) => (
            <TR key={user.id}>
              <TD className="font-medium">{user.id.slice(-5)}</TD>
              <TD>{user.name}</TD>
              <TD>{user.email}</TD>
              <TD>{user.role}</TD>
              <TD>
                <Badge color={STATUS_COLOR[user.status]}>{user.status}</Badge>
              </TD>
              <TD>
                {checkManageUserAuthorization(
                  sessionData!.user.role,
                  user.role
                ) && (
                  <div className="flex gap-2">
                    <Button
                      shape="square"
                      onClick={() => openEditUserModal(user)}
                    >
                      <FiEdit3 />
                    </Button>
                    <Button
                      shape="square"
                      color="error"
                      onClick={() => openDeleteUserModal(user)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <EditUserModal
        userData={userData as EditUserInput}
        submitEditHandler={handleEditUser}
        open={isOpenModalEditUser}
        close={() => setOpenModalEditUser(false)}
      />
      <DeleteUserModal
        userData={userData}
        handleDeleteUser={handleDeleteUser}
        open={isOpenModalDeleteUser}
        close={() => setOpenModalDeleteUser(false)}
      />
      <CreateUserModal
        submitCrateUser={handleCreateUser}
        open={isOpenModalCreateUser}
        close={() => setOpenModalCreateUser(false)}
      />
    </div>
  );
};

ManageUser.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ManageUser;

export const getServerSideProps = pageAuth();
