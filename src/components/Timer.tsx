import React, { useEffect, useRef, useState } from 'react';

interface Objective {
  label: string;
  time: number; // seconds
  message: string;
  audio?: string; // audio file or text-to-speech (optional, fallback to message)
  repeat?: number; // interval in seconds for repeat
}

interface TimerProps {
  objectives: Objective[];
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
}

const Timer: React.FC<TimerProps> = ({ objectives }) => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [notified, setNotified] = useState<{ [key: number]: boolean }>({});
  const [editMode, setEditMode] = useState(false);
  const [editMin, setEditMin] = useState(0);
  const [editSec, setEditSec] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && !editMode) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, editMode]);

  useEffect(() => {
    objectives.forEach((obj) => {
      const audioText = obj.message;
      if (
        seconds === obj.time &&
        !notified[obj.time]
      ) {
        speak(audioText);
        setNotified((n) => ({ ...n, [obj.time]: true }));
      }
      // Handle repeat objectives
      if (obj.repeat && seconds > obj.time && (seconds - obj.time) % obj.repeat === 0 && !notified[seconds]) {
        speak(audioText);
        setNotified((n) => ({ ...n, [seconds]: true }));
      }
    });
  }, [seconds, notified, objectives]);

  const handleStart = () => {
    if (editMode) {
      setSeconds(editMin * 60 + editSec);
      setEditMode(false);
      setRunning(true);
    } else {
      setRunning(true);
    }
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    if (editMode) {
      setEditMin(0);
      setEditSec(0);
    } else {
      setRunning(false);
      setSeconds(0);
      setNotified({}); // <-- Reset notified state so audio will play again
    }
  };

  const handleEdit = () => {
    setEditMin(Math.floor(seconds / 60));
    setEditSec(seconds % 60);
    setEditMode(true);
  };

  const handleEditSave = () => {
    setSeconds(editMin * 60 + editSec);
    setEditMode(false);
    setRunning(true);
    setNotified({}); // <-- Reset notified state on edit save as well
  };

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return (
    <div className="timer-container">
      <h1>Deadlock Objective Timer</h1>
      <div className="timer-display">
        {editMode ? (
          <>
            <input
              type="number"
              min={0}
              value={editMin}
              onChange={e => setEditMin(Number(e.target.value))}
              style={{ width: 70, fontSize: '1em', marginRight: 4 }}
            />
            :
            <input
              type="number"
              min={0}
              max={59}
              value={editSec}
              onChange={e => setEditSec(Number(e.target.value))}
              style={{ width: 70, fontSize: '1em', marginLeft: 4 }}
            />
            <button onClick={handleEditSave} style={{ marginLeft: 12, fontSize: '0.5em' }}>Save & Start</button>
          </>
        ) : (
          <>
            {min}:{sec.toString().padStart(2, '0')}
          </>
        )}
      </div>
      <div className="timer-controls">
        <button onClick={handleStart} disabled={running}>Start</button>
        <button onClick={handlePause} disabled={!running}>Pause</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleEdit} style={{ marginLeft: 16, fontSize: '1.1em' }}>Edit</button>
      </div>
      <ul className="objectives-list">
        {objectives
          .slice() // copy
          .sort((a, b) => (a.time - seconds) - (b.time - seconds)) // sort by next to trigger descending
          .map((obj) => (
            <li key={obj.label + obj.time} className={seconds >= obj.time ? 'done' : ''}>
              <strong>{obj.label}</strong> at {Math.floor(obj.time / 60)}:{(obj.time % 60).toString().padStart(2, '0')} — {obj.message}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Timer;
