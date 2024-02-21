import { useTimerStore } from "@/store/TimerStore";
import Context from "@/utils/Context";
import CmdsMethods from "@/utils/methods";
import React, { FC, useContext, useEffect, useRef, useState } from "react";

const Timer: FC<{ title: string }> = ({ title }) => {
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const frameRef = useRef<number>();
  //storing the run time of timer
  const startTimeRef = useRef<number>(Date.now());
  //storing the total timer of pause
  const totalPausedTimeRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number>(0);
  const { getTimerInfo } = useTimerStore();
  const getContext = useContext(Context);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!isPaused) {
        const now = Date.now();
        elapsedRef.current =
          now - startTimeRef.current - totalPausedTimeRef.current;
        const secondsElapsed = Math.floor(elapsedRef.current / 1000);
        setDisplayTime(CmdsMethods.formatDuration(secondsElapsed));
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    if (!isPaused) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPaused]);

  const handlePause = () => {
    if (!isPaused) {
      setIsPaused(true);
      pauseStartTimeRef.current = Date.now(); // Store the pause start time
    }
  };

  const handleContinue = () => {
    if (isPaused) {
      const pauseEndTime = Date.now();
      // Update totalPausedTimeRef by adding the duration of this pause
      totalPausedTimeRef.current += pauseEndTime - pauseStartTimeRef.current;
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure to reset timer?");
    if (confirmReset) {
      setDisplayTime("00:00:00");
      setIsPaused(true); // Stop the timer
      startTimeRef.current = Date.now(); // Reset start time
      totalPausedTimeRef.current = 0; // Reset total paused time
      pauseStartTimeRef.current = 0; // Reset pause start time

      setTimeout(() => {
        getContext?.removeCommand(`run timer for ${title}`);
      }, 1000);
    }
  };

  const saveTime = () => {
    const confirmToSave = window.confirm("Are you sure to save timer?");
    if (confirmToSave) {
      getTimerInfo(elapsedRef.current, title);
      setDisplayTime("00:00:00");
      setIsPaused(true);
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
      pauseStartTimeRef.current = 0;

      setTimeout(() => {
        getContext?.removeCommand(`run timer for ${title}`);
      }, 1000);
    }
  };

  return (
    <div className="fixed w-60 rounded-md border p-3 flex bottom-4 right-4 flex-col gap-4 z-1 bg-slate-300 text-black">
      <h4>{title}</h4>
      <div className="flex items-center gap-3">
        {isPaused && pauseStartTimeRef.current > 0 ? (
          <button onClick={handleContinue}>Continue</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={saveTime}>Save</button>
      </div>
      <span className="text-2xl">{displayTime}</span>
    </div>
  );
};

const MemoizeTimer = React.memo(Timer);

export default MemoizeTimer;
