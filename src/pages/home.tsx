import { useSession } from 'next-auth/react';

import { TextInput } from '@/components/TextInput';
import { Label } from '@/components/Label';
import { FormControl } from '@/components/FormControl';
import { FieldInfo } from '@/components/FieldInfo';
import { pageAuth } from '@/utils/pageAuth';

export default function Home() {
  const { data: sessionData } = useSession();

  console.log(sessionData);

  return (
    <div className="p-8">
      <h1>{JSON.stringify(sessionData)}</h1>
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
