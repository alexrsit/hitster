import React from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle Theme"
      className="p-2 rounded-full focus:outline-none"
    >
      {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
    </button>
  );
};

export default ThemeToggle;