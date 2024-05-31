import React, { useContext } from 'react';
import { ThemeContext } from '../../../providers/ThemeProvider';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ThemeSwitcher: React.FC = () => {
  const { themeValue, setThemeValue } = useContext(ThemeContext);
  const changeTheme = () => {
    setThemeValue('light');
  };

  return (
    <Button shape="circle" icon={themeValue === 'light' ? <MoonOutlined /> : <SunOutlined />} onClick={changeTheme} />
  );
};

export default ThemeSwitcher;
