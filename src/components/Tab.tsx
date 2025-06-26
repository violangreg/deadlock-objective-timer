import React from 'react';

interface TabProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ active, label, onClick }) => (
  <button
    className={`tab${active ? ' active' : ''}`}
    onClick={onClick}
    style={{
      padding: '10px 24px',
      border: 'none',
      borderBottom: active ? '2px solid #2d8cf0' : '2px solid transparent',
      background: 'none',
      color: active ? '#2d8cf0' : '#888',
      fontWeight: active ? 600 : 400,
      fontSize: '1.1em',
      cursor: 'pointer',
      outline: 'none',
      transition: 'color 0.2s',
    }}
  >
    {label}
  </button>
);

export default Tab;
