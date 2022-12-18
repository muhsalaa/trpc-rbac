import { pageAuth } from '@/utils/pageAuth';
import { AppLayout } from '@/components/layout/App';
import { NextPageWithLayout } from '@/types/page';

const Settings: NextPageWithLayout = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Settings</h1>
    </div>
  );
};

Settings.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Settings;

export const getServerSideProps = pageAuth();
