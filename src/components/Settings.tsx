import React, { useEffect } from 'react';

interface SettingsProps {
  objectives: any[];
  onUpdate: (objectives: any[]) => void;
}

const OBJECTIVES_KEY = 'deadlock_objectives_v1';

const Settings: React.FC<SettingsProps> = ({ objectives, onUpdate }) => {
  // Identify default objectives by index (not deletable)
  const defaultCount = objectives.findIndex(obj => obj.custom) === -1 ? objectives.length : objectives.findIndex(obj => obj.custom);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(OBJECTIVES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          onUpdate(parsed);
        }
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  // Save to localStorage on objectives change
  useEffect(() => {
    localStorage.setItem(OBJECTIVES_KEY, JSON.stringify(objectives));
  }, [objectives]);

  const handleChange = (idx: number, field: string, value: string | number | boolean) => {
    const updated = objectives.map((obj, i) =>
      i === idx ? { ...obj, [field]: value } : obj
    );
    onUpdate(updated);
  };

  const handleAdd = () => {
    const updated = [
      ...objectives,
      { label: '', time: 0, message: '', repeat: undefined, custom: true, enableRepeat: false }
    ];
    onUpdate(updated);
  };

  const handleDelete = (idx: number) => {
    if (idx < defaultCount) return; // Prevent deleting default objectives
    const updated = objectives.filter((_, i) => i !== idx);
    onUpdate(updated);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <ul>
        {objectives.map((obj, idx) => (
          <li key={obj.custom ? `custom-${idx}` : obj.label + obj.time} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <input
              type="text"
              value={obj.label}
              onChange={e => handleChange(idx, 'label', e.target.value)}
              placeholder="Name"
              style={{ width: 90, marginRight: 8 }}
              disabled={idx < defaultCount}
              name={`label-${idx}`}
              autoComplete="off"
            />
            at
            <input
              type="number"
              min={0}
              value={obj.time}
              onChange={e => handleChange(idx, 'time', e.target.value === '' ? '' : Number(e.target.value))}
              style={{ width: 60, margin: '0 8px' }}
              name={`time-${idx}`}
              autoComplete="off"
            />
            seconds
            <input
              type="text"
              value={obj.message}
              onChange={e => handleChange(idx, 'message', e.target.value)}
              placeholder="Audio message"
              style={{ width: 220, margin: '0 8px' }}
              name={`message-${idx}`}
              autoComplete="off"
            />
            <input
              type="checkbox"
              checked={!!obj.repeat}
              onChange={e => handleChange(idx, 'repeat', e.target.checked ? (obj.repeat || 300) : undefined)}
              style={{ marginLeft: 12 }}
              id={`repeat-${idx}`}
            />
            <label htmlFor={`repeat-${idx}`} style={{ marginLeft: 4, marginRight: 4 }}>Repeat</label>
            {obj.repeat !== undefined && (
              <>
                every
                <input
                  type="number"
                  min={1}
                  value={obj.repeat}
                  onChange={e => handleChange(idx, 'repeat', Number(e.target.value))}
                  style={{ width: 60, margin: '0 8px' }}
                />
                seconds
              </>
            )}
            {idx >= defaultCount && (
              <button
                onClick={() => handleDelete(idx)}
                style={{ marginLeft: 12, color: 'red', background: 'none', border: 'none', fontSize: '1.2em', padding:'0px', cursor: 'pointer' }}
                title="Delete objective"
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleAdd} style={{ marginTop: 12, padding: '6px 18px', fontSize: '1em' }}>Add Objective</button>
    </div>
  );
};

export default Settings;
