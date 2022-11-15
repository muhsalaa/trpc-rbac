import { useSession } from "next-auth/react";

import { trpc } from "@/utils/trpc";
import { TextInput } from "@/components/TextInput";
import { Label } from "@/components/Label";
import { FormControl } from "@/components/FormControl";
import { FieldInfo } from "@/components/FieldInfo";
import { pageAuth } from "@/utils/pageAuth";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data, error, isLoading } = trpc.user.dummyUser.useQuery(
    { name: "Andrew" },
    {
      // can put configuration for query here
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
  const { data: loginData } = trpc.user.loginUser.useQuery(undefined, {
    enabled: true,
  });

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
    <div className="p-8">
      <h1>
        {data?.message} {loginData} {JSON.stringify(sessionData)}
      </h1>
      <FormControl>
        <Label htmlFor="name">Name</Label>
        <TextInput invalid id="name" name="name" placeholder="John Doe" />
        <FieldInfo type="error">
          Terjadi kesalahan pada pengetikan nama
        </FieldInfo>
      </FormControl>
      <FormControl>
        <Label required htmlFor="email">
          Email
        </Label>
        <TextInput id="email" name="email" placeholder="doe@gmail.com" />
        <FieldInfo type="notes">Tulis email anda dengan benar</FieldInfo>
      </FormControl>
    </div>
  );
}

export const getServerSideProps = pageAuth();
