import { useRef, useState } from "react";

const useTimer = () => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeInSec, setTimeInSec] = useState(0);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeInSec((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return { timeInSec, setTimeInSec, startTimer, stopTimer };
};

export default useTimer;
