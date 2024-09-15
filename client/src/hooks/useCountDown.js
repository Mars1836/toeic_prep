"use client";
const { useState, useEffect } = require("react");

const useCountdown = ({
  timeCD,
  onEndTime = () => {
    console.log("End Time");
  },
  onStart = () => {},
}) => {
  const [time, setTime] = useState(timeCD);
  const [loop, setLoop] = useState(0);
  useEffect(() => {
    console.log(loop);
    console.log(time);
    if (!loop) {
      return;
    }
    if (time === undefined) {
      return;
    }
    onStart();

    const id = setInterval(() => {
      setTime((pre) => {
        if (pre < 2) {
          clearInterval(id);
          onEndTime();
          return 0;
        }
        return pre - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loop]);
  useEffect(() => {
    console.log(time);
  }, [time]);
  function startCountdown() {
    setTime(timeCD);
    setLoop((pre) => pre + 1);
  }

  return { loop, time, setTime, onEndTime, startCountdown };
};

export default useCountdown;
