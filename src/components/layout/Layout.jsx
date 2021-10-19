import React, { useEffect, useState } from 'react';
import './layout.css';
import Sidebar from '../sidebar/Sidebar';
import TopNav from '../topnav/TopNav';
import { useDispatch, useSelector } from 'react-redux';
import ThemeAction from '../../redux/actions/ThemeAction';
import Stack from '@mui/material/Stack';

const Layout = props => {
  const themeReducer = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const clickOpen = () => {
    setOpen(prevState => !prevState);
  };
  useEffect(() => {
    const themeClass = localStorage.getItem('themeMode', 'theme-mode-light');
    const colorClass = localStorage.getItem('colorMode', 'theme-mode-light');
    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
        {open && <Sidebar clickOpen={() => clickOpen()} {...props.extra} />}
        <div className="layout__content">
          <TopNav clickOpen={() => clickOpen()} />
          {open ? (
            <div onClick={clickOpen} className="layout__content-main1">
              {/*{...Routes}*/}
              {props.children}
            </div>
          ) : (
            <div className="layout__content-main">
              {/*{...Routes}*/}
              {props.children}
            </div>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default Layout;
