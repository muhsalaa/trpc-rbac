import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  FiChevronUp,
  FiEdit3,
  FiTrash2,
  FiUserPlus,
  FiLoader,
} from 'react-icons/fi';

import { AppLayout } from '@/components/layout/App';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Table, THead, TR, TH, TBody, TD } from '@/components/atoms/Table';
import { PopUp } from '@/components/atoms/PopUp';
import { EditUserModal } from '@/modules/manage-users/EditUserModal';
import { CreateUserModal } from '@/modules/manage-users/CreateUserModal';
import { DeleteUserModal } from '@/modules/manage-users/DeleteUserModal';
import { Pagination } from '@/components/atoms/Pagination';

import { pageAuth } from '@/utils/pageAuth';
import { trpc } from '@/utils/trpc';
import { range } from '@/utils/array';
import { checkManageUserAuthorization } from '@/utils/authorization';
import { RouterOutput } from '@/server/trpc/router/_app';
import { NextPageWithLayout } from '@/types/page';
import { EditUserInput } from '@/schema/user.schema';
import { STATUS_COLOR } from '@/constants/theme';
import { Role, Status } from '@prisma/client';

type UserOutput = RouterOutput['user']['getMe'];

const DATA_PER_PAGE = 2;

const ManageUser: NextPageWithLayout = () => {
  const [isOpenModalEditUser, setOpenModalEditUser] = useState(false);
  const [userDataPage, setUserDataPage] = useState(1);
  const [isOpenModalCreateUser, setOpenModalCreateUser] = useState(false);
  const [isOpenModalDeleteUser, setOpenModalDeleteUser] = useState(false);
  const [isPopUpShow, setPopUpShow] = useState(false);
  const [popUpContent, setPopUpContent] = useState({ title: '', content: '' });
  const [userData, setUserData] = useState<UserOutput>();

  const { data: sessionData } = useSession();
  const { data, refetch, isRefetching, isLoading } =
    trpc.user.getAllUser.useQuery({
      per_page: DATA_PER_PAGE,
      page: userDataPage,
    });

  const openEditUserModal = (user: UserOutput) => {
    setUserData(user);
    setOpenModalEditUser(true);
  };

  const openDeleteUserModal = (user: UserOutput) => {
    setUserData(user);
    setOpenModalDeleteUser(true);
  };

  const onSuccessEditUser = () => {
    refetch();
    setPopUpContent({
      title: 'User edited',
      content:
        'User successfully edited. Note that changing email will make user status to NEW again (need to reverify email)',
    });
    setPopUpShow(true);
  };

  const onSuccessDeleteUser = () => {
    refetch();
    setPopUpContent({
      title: 'User deleted',
      content: 'User successfully deleted.',
    });
    setPopUpShow(true);
  };

  const onSuccessCreateUser = () => {
    refetch();
    setPopUpContent({
      title: 'User created',
      content:
        'User successfully created. He/She must confirm the email within 24 hours',
    });
    setPopUpShow(true);
  };

  return (
    <div className="p-8">
      <h1 className="mb-2 text-4xl font-bold">Manage User</h1>
      <div className="flex h-8">
        {isRefetching ||
          (isLoading && (
            <FiLoader className="ml-auto mr-2 animate-spin text-2xl" />
          ))}
      </div>

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
          {data?.users.map((user) => (
            <TR key={user.id}>
              <TD className="font-medium">{user.id.slice(-5)}</TD>
              <TD>{user.name}</TD>
              <TD>{user.email}</TD>
              <TD>{user.role}</TD>
              <TD>
                <Badge color={STATUS_COLOR[user.status]}>{user.status}</Badge>
              </TD>
              <TD>
                <div className="flex min-h-[32px] gap-2">
                  {checkManageUserAuthorization(
                    sessionData!.user.role,
                    user.role
                  ) && (
                    <>
                      {/* enable edit fro NEW user only for ADMIN role */}
                      {!(
                        user.status === Status.NEW &&
                        sessionData!.user.role !== Role.ADMIN
                      ) && (
                        <Button
                          shape="square"
                          onClick={() => openEditUserModal(user)}
                        >
                          <FiEdit3 />
                        </Button>
                      )}
                      <Button
                        shape="square"
                        color="error"
                        onClick={() => openDeleteUserModal(user)}
                      >
                        <FiTrash2 />
                      </Button>
                    </>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      {!data &&
        range(DATA_PER_PAGE).map((x) => (
          <div
            key={x + 'xx'}
            className="mt-1 h-10 w-full animate-pulse rounded-md bg-neutral-300"
          />
        ))}

      <Pagination
        className="mt-8"
        setPage={setUserDataPage}
        page={userDataPage}
        perPage={DATA_PER_PAGE}
        totalData={data?.total!}
      />

      <EditUserModal
        userData={userData as EditUserInput}
        onSuccess={onSuccessEditUser}
        open={isOpenModalEditUser}
        close={() => setOpenModalEditUser(false)}
      />
      <DeleteUserModal
        userData={userData}
        open={isOpenModalDeleteUser}
        onSuccess={onSuccessDeleteUser}
        close={() => setOpenModalDeleteUser(false)}
      />
      <CreateUserModal
        open={isOpenModalCreateUser}
        onSuccess={onSuccessCreateUser}
        close={() => setOpenModalCreateUser(false)}
      />
      <PopUp
        {...popUpContent}
        show={isPopUpShow}
        close={() => setPopUpShow(false)}
      />
    </div>
  );
};

ManageUser.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ManageUser;

export const getServerSideProps = pageAuth();
