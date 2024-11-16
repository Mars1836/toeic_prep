import { Clock1, Clock10, Clock12 } from "lucide-react";
import React, { useEffect, useState } from "react";
function formatNumber(num) {
  return String(Math.floor(num / 10)) + (num % 10);
}
function getTotalSecond(h, m, s, limit) {
  const time = 60 * 60 * h + 60 * m + s;
  if (limit) {
    return limit - time;
  }
  return time;
}
function ClockCtrl({
  isRun,
  limit = 0,
  onTimeOut = () => {
    console.log("timeout");
  },
}) {
  console.log(limit);
  const [m, setM] = useState(Math.floor((limit % 3600) / 60) ?? 0);
  const [s, setS] = useState(Math.floor(limit % 60) ?? 0);
  const [h, setH] = useState(Math.floor(limit / 3600) ?? 0);
  const [run, setRun] = useState(true);
  const [isCountDown, setIsCountDown] = useState(!!limit);
  function isTimeout() {
    return m === 0 && s === 0 && h === 0 && isCountDown;
  }

  useEffect(() => {
    let ids;

    if (isCountDown) {
      ids = setInterval(() => {
        setS((pre) => pre + -1);
      }, 1000);
    } else {
      ids = setInterval(() => {
        setS((pre) => pre + 1);
      }, 1000);
    }
    if (!run) {
      clearInterval(ids);
    }
    if (!isRun) {
      clearInterval(ids);
    }
    return () => {
      clearInterval(ids);
    };
  }, [isRun, run]);
  useEffect(() => {
    if (isTimeout() && isCountDown) {
      onTimeOut();
      setRun(false);
    }
    if (s > 59 && !isCountDown) {
      setS(0);
      setM((pre) => pre + 1);
    }
    if (s < 0 && isCountDown) {
      setS(59);
      setM((pre) => pre - 1);
    }
  }, [s]);
  useEffect(() => {
    if (m > 59 && !isCountDown) {
      setM(0);
      setH((pre) => pre + 1);
    }
    if (m < 0 && isCountDown) {
      setM(59);
      setH((pre) => pre - 1);
    }
  }, [m]);
  return (
    <div className="flex items-center justify-center p-4 p-6 px-4">
      <p className="flex items-center gap-2 text-3xl font-bold">
        <Clock10 size={30}></Clock10>
        {formatNumber(h)}:{formatNumber(m)}:{formatNumber(s)}
      </p>
    </div>
  );
}

export default ClockCtrl;
