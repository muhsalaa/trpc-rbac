// import { trpc } from '@/utils/trpc';

export default function Home() {
  // const { data, error, isLoading } = trpc.user.dummyUser.useQuery(
  //   { name: 'Andrew' },
  //   {
  //     // can put configuration for query here
  //     refetchOnWindowFocus: false,
  //     retry: 2,
  //   }
  // );
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to Home</h1>
    </div>
  );
}
