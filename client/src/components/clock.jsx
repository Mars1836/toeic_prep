import { Clock1, Clock10, Clock12 } from "lucide-react";
import React, { useEffect, useState } from "react";
function formatNumber(num) {
  return String(Math.floor(num / 10)) + (num % 10);
}
function getTotalSecond(h, m, s) {
  return 60 * 60 * h + 60 * m + s;
}
function Clock({ run }) {
  const [m, setM] = useState(0);
  const [s, setS] = useState(0);
  const [h, setH] = useState(0);
  useEffect(() => {
    const ids = setInterval(() => {
      setS((pre) => pre + 1);
    }, 1000);
    if (!run) {
      clearInterval(ids);
    }
    return () => {
      clearInterval(ids);
    };
  }, [run]);
  useEffect(() => {
    if (s > 59) {
      setS(0);
      setM((pre) => pre + 1);
    }
  }, [s]);
  useEffect(() => {
    if (m > 59) {
      setM(0);
      setH((pre) => pre + 1);
    }
  }, [m]);
  return (
    <div className="fixed right-1/2 top-16 z-40 flex h-20 translate-x-2/4 items-center justify-center border bg-slate-100 px-4 shadow-md">
      <p className="flex items-center gap-2 text-3xl font-bold">
        <Clock10 size={30}></Clock10>
        {formatNumber(h)}:{formatNumber(m)}:{formatNumber(s)}
      </p>
    </div>
  );
}

export default Clock;
