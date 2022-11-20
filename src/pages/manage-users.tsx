import { pageAuth } from '@/utils/pageAuth';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Manage users</h1>
    </div>
  );
}

export const getServerSideProps = pageAuth();
