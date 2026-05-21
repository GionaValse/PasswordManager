import { useState } from 'react';
import styles from './ThemeSwitch.module.css';

interface ThemeSwitchProps {
  id?: string;
}

export function ThemeSwitch({ id = 'theme-switch' }: ThemeSwitchProps) {
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');

  const [isDarkTheme, setIsDarkTheme] = useState(darkModePreference.matches);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => {
      const theme = prevTheme ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      return !prevTheme;
    });
  };

  darkModePreference.addEventListener('change', (e) => {
    setIsDarkTheme(e.matches);
  });

  return (
    <div id={id} data-testid={`test-${id}`} className={styles.themeSwitch}>
      <label
        id={`${id}-label`}
        data-testid={`test-${id}-label`}
        htmlFor={`${id}-toggle`}
        className={styles.switch}
      >
        <input
          id={`${id}-toggle`}
          data-testid={`test-${id}-toggle`}
          name={`${id}-toggle`}
          type="checkbox"
          title="theme toggle"
          checked={!isDarkTheme}
          onChange={toggleTheme}
        />
        <span
          id={`${id}-slider`}
          data-testid={`test-${id}-slider`}
          className={styles.slider}
        ></span>
      </label>
    </div>
  );
}
