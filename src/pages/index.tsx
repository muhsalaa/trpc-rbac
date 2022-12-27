// import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Modal } from '@/components/molecules/Modal';
import Link from 'next/link';

import {
  RadioButton,
  type RadioButtonProps,
} from '@/components/molecules/RadioButton';

export default function Home() {
  // const { data, error, isLoading } = trpc.user.dummyUser.useQuery(
  //   { name: 'Andrew' },
  //   {
  //     // can put configuration for query here
  //     refetchOnWindowFocus: false,
  //     retry: 2,
  //   }
  // );
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<RadioButtonProps['selectedValue']>();
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to Home</h1>
      <Button className="my-8 mb-20 mr-5 border-8 border-red-200">TEST</Button>
      <Link href="/auth/login">
        <Button className="my-8 mb-20 mr-5 border-8 border-red-200">
          Login
        </Button>
      </Link>
      <Button color="success" onClick={() => setIsOpen(true)}>
        TEST
      </Button>
      <Card>HAHA</Card>
      <Card size="small">HAHA</Card>
      <Card size="big">HAHA</Card>
      <Modal open={isOpen} close={() => setIsOpen(false)}>
        HAHAH
      </Modal>
      <RadioButton
        className="mt-40"
        setSelectedValue={setColor}
        selectedValue={color}
        options={[
          { value: 'green', display: 'Green' },
          { value: 'red', display: 'Red' },
          { value: 'blue', display: 'Blue' },
          { value: 'pink', display: 'Pink' },
        ]}
        name="warna"
      />
    </div>
  );
}
