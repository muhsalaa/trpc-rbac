import { useSession } from 'next-auth/react';

import { TextInput } from '@/components/atoms/TextInput';
import { Label } from '@/components/atoms/Label';
import { FormControl } from '@/components/atoms/FormControl';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { AppLayout } from '@/components/layout/App';

import { pageAuth } from '@/utils/pageAuth';
import { NextPageWithLayout } from '@/types/page';

const Home: NextPageWithLayout = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="p-8">
      <pre className="mb-8">{JSON.stringify(sessionData, null, '\t')}</pre>
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
};

Home.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Home;

export const getServerSideProps = pageAuth();
