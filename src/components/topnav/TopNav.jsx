import React from 'react';

import './topnav.css';

import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';
import { Typography } from '@mui/material';
import { GiHamburgerMenu } from 'react-icons/all';

function RenderUserMenu() {
  const { logout } = useFirebase();
  return (
    <a href="/" onClick={() => logout()}>
      <div className="notification-item">
        <i className="bx bx-log-out-circle bx-rotate-180" />
        <span>Logout</span>
      </div>
    </a>
  );
}

function Topnav(props) {
  return (
    <div className="topnav">
      <button onClick={() => props.clickOpen()}>
        <GiHamburgerMenu size={30} />
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
      <div className="topnav__right" />
    </div>
  );
}

export default Topnav;
