import { useState, useEffect, useRef } from 'react';

const ONE_SECOND = 1000;

type CountdownProps = {
  duration: number;
  onEnd?: () => void;
  timeout?: number;
  interval?: boolean;
  manual?: boolean;
};

/**
 * Helpers to get countdown time
 *
 * duration | countdown duration in seconds
 * onEnd    | callback that will be startTimerd on countdown end
 * timeout  | timeout time for each setTimeout. default to 1000 miliseconds
 * interval | condition to set countdown as interval or not, if true, duration will be reset on end
 * manual   | boolean if counter should be triggered manually
 */
export const useCountdown = ({
  duration,
  onEnd = () => {},
  timeout = ONE_SECOND,
  interval,
  manual = false,
}: CountdownProps) => {
  const countDownRef = useRef<NodeJS.Timeout>();
  const [count, setCount] = useState<number>(manual ? 0 : duration);
  const [isStarted, setStarted] = useState(!manual);

  const startTimer = (customDuration?: number) => {
    // set custom duration first (like persisted delay), then default to specified duration
    setCount(customDuration || duration);
    setStarted(true);
  };

  useEffect(() => {
    if (!isStarted) return;
    if (count > 0) {
      countDownRef.current = setTimeout(() => setCount((c) => c - 1), timeout);
    } else {
      clearTimeout(countDownRef.current);
      onEnd();

      // reset if manual
      if (manual) {
        setStarted(false);
        setCount(0);
      }

      // reset duration on countdown end
      if (interval) {
        setCount(duration);
      }
    }

    return () => clearTimeout(countDownRef.current);
  }, [count, isStarted]);

  return { count, startTimer };
};

/**
 * Helpers to get countdown time as hour:minutes:second string
 */
export const useTimeCounter = (config: CountdownProps) => {
  const { count, startTimer } = useCountdown(config);
  const { duration } = config;

  // toISOString() method will return date string like this '2022-06-29T06:08:25.286Z'
  // this substr is only to determine should it cut the string to
  // hour:minutes:seconds or minutes:seconds
  const substr: [number, number] = duration > 3599 ? [11, 19] : [14, 19];

  return {
    count,
    timer: new Date(count * ONE_SECOND).toISOString().substring(...substr),
    startTimer,
  };
};
