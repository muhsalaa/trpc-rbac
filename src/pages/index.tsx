// import { trpc } from '@/utils/trpc';

import { Alert } from '@/components/atoms/Alert';
import { Button } from '@/components/atoms/Button';

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
      <Button className="my-8 mb-20 mr-5 border-8 border-red-200">TEST</Button>
      <Button color="success">TEST</Button>
      <Button color="warning">TEST</Button>
      <Button color="warning" disabled>
        TEST
      </Button>
      <Button block>TEST</Button>
      <Alert className="my-4">TEST</Alert>
      <Alert className="my-4" color="error">
        TEST
      </Alert>
      <Alert className="my-4" color="warning">
        TEST
      </Alert>
      <Alert className="my-4" color="success">
        TEST
      </Alert>
    </div>
  );
}
