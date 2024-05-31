import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';

type ThemeContextType = {
  themeValue: string;
  setThemeValue: (themeValue: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const getTheme = localStorage.getItem('appTheme');
  const isSystemPreferenceDark = window?.matchMedia('(prefers-color-scheme: dark)').matches;
  const browserSettings = isSystemPreferenceDark ? 'dark' : 'light';
  const [themeValue, setThemeValue] = useState(getTheme || browserSettings);

  useEffect(() => {
    window.localStorage.setItem('appTheme', themeValue);
  }, [themeValue]);

  const setColorMode = () => {
    if (themeValue === 'light') {
      setThemeValue('dark');
    } else {
      setThemeValue('light');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        setThemeValue: setColorMode,
        themeValue,
      }}
    >
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm: themeValue === 'light' ? defaultAlgorithm : darkAlgorithm,
          components: {
            Layout: {
              headerBg: themeValue === 'light' ? '#ffffff' : '#141414',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
