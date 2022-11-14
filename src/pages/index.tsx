import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data, error, isLoading } = trpc.useQuery(
    ["users.dummy-user", { name: "World" }],
    {
      // can put configuration for query here
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  console.log(sessionData);

  if (isLoading) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{data?.message}</h1>
    </div>
  );
}
