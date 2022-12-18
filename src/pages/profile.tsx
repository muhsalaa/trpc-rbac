import { pageAuth } from '@/utils/pageAuth';
import { AppLayout } from '@/components/layout/App';
import { NextPageWithLayout } from '@/types/page';

const Profile: NextPageWithLayout = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Profile</h1>
    </div>
  );
};

Profile.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Profile;

export const getServerSideProps = pageAuth();
