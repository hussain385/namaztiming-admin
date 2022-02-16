import React from 'react';

import './topnav.css';

import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';
import { Typography } from '@mui/material';
import user_image from '../../assets/images/tuat.png';

import user_menu from '../../assets/JsonData/user_menus.json';
import UserDropDown from '../User-dropdown/UserDropDown';

const curr_user = {
  display_name: 'Admin Panel',
  image: user_image,
};

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = user => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const RenderUserMenu = () => {
  const { logout } = useFirebase();
  return (
    <>
      <a href="/" onClick={() => logout()}>
        <div className="notification-item">
          <i className="bx bx-log-out-circle bx-rotate-180"></i>
          <span>Logout</span>
        </div>
      </a>
    </>
  );
};

const Topnav = props => {
  return (
    <div className="topnav">
      <button onClick={() => props.clickOpen()}>
        <i style={{ fontSize: 25 }} className="fas fa-bars" />
      </button>
      <Link className="heading" to="/">
        <Typography
          sx={{
            fontSize: '30px !important',
            fontWeight: 'bold !important',
          }}
        >
          Namaz Timings
        </Typography>
      </Link>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <UserDropDown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={() => RenderUserMenu()}
          />
        </div>
        {/* <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div> */}
      </div>
    </div>
  );
};

export default Topnav;
