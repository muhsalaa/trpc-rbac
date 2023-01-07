import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

import { Alert } from '@/components/atoms/Alert';
import { AuthLayout } from '@/components/layout/Auth';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ErrorAlert } from '@/components/molecules/ErrorAlert';
import { FormControl } from '@/components/atoms/FormControl';
import { FieldInfo } from '@/components/atoms/FieldInfo';
import { Label } from '@/components/atoms/Label';
import { Spinner } from '@/components/atoms/Spinner';
import { TextInput } from '@/components/atoms/TextInput';

import { pageAuth } from '@/utils/pageAuth';
import { getBaseUrl, trpc } from '@/utils/trpc';
import { useTimeCounter } from '@/hooks/useCountdown';
import { NextPageWithLayout } from '@/types/page';
import { LoginUserInput, loginUserSchema } from '@/schema/user.schema';
import { HOME } from '@/constants/pages';

const STORAGE_LOGIN_DELAY_KEY = 'ldpc';
const DELAY_DURATION = 60;

const Login: NextPageWithLayout = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isWaiting, setWaiting] = useState(false);
  const [startedTime, setStartedTime] = useState(0);
  const { mutateAsync, isError, error } = trpc.user.loginUser.useMutation();

  // create counter for delaying user submit another email after succeeded sent one
  const { startTimer, timer } = useTimeCounter({
    manual: true,
    onEnd: () => {
      setWaiting(false);
      setSuccess(false);
    },
    duration: DELAY_DURATION,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const handleLogin: SubmitHandler<LoginUserInput> = async ({ email }) => {
    // guard html modification via devtools
    if (isLoading || isWaiting) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const user = await mutateAsync({ email });
      if (user) {
        const result = await signIn('email', {
          email,
          redirect: false,
          callbackUrl: getBaseUrl() + HOME,
        });

        setSuccess(Boolean(result?.ok));
        setWaiting(true);
        reset();

        // start the countdown
        // and set countdown started time
        startTimer();
        setStartedTime(Date.now());
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // callback to set timestamps into localstorage
  // this triggered if user refresh or close tab.
  const persistDelay = () => {
    if (startedTime)
      localStorage.setItem(
        STORAGE_LOGIN_DELAY_KEY,
        (startedTime + DELAY_DURATION * 1000).toString()
      );
  };

  useEffect(() => {
    const persistedCount = localStorage.getItem(STORAGE_LOGIN_DELAY_KEY);

    if (persistedCount && !isWaiting) {
      // get remainder seconds of login delay, minimum value is 0
      const loginDelay = Math.max(
        Math.ceil((parseInt(persistedCount) - Date.now()) / 1000),
        0
      );

      if (loginDelay) {
        setWaiting(true);
        setSuccess(true);
        startTimer(loginDelay);
      } else {
        localStorage.removeItem(STORAGE_LOGIN_DELAY_KEY);
      }
    }

    window.addEventListener('beforeunload', persistDelay);

    return () => {
      window.removeEventListener('beforeunload', persistDelay);
    };
  }, [startedTime, isWaiting]);

  return (
    <Card size="small">
      <h1 className="mb-2 text-lg font-medium">Login</h1>
      {isError && <ErrorAlert errors={error} className="mb-2" />}
      {isLoading && <Spinner />}
      {isSuccess && (
        <Alert className="mb-2" color="success">
          Berhasil, kami telah mengirim login link ke emailmu.
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleLogin)}>
        <FormControl>
          <Label htmlFor="email">Email</Label>
          <TextInput
            invalid={Boolean(errors.email)}
            id="email"
            placeholder="john@example.com"
            {...register('email')}
          />
          {errors.email?.message && (
            <FieldInfo type="error">{errors.email.message}</FieldInfo>
          )}
        </FormControl>
        <Button
          type="submit"
          block
          className="mt-4"
          disabled={isLoading || isWaiting}
        >
          Login
        </Button>
      </form>

      {isSuccess && (
        <FieldInfo type="notes" className="mt-2">
          Belum menerima email? Kirim ulang dalam {timer} detik
        </FieldInfo>
      )}
    </Card>
  );
};

Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Login;

export const getServerSideProps = pageAuth();
