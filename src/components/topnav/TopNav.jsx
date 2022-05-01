import React from 'react';

import './topnav.css';

import { Link } from 'react-router-dom';
import { useFirebase } from 'react-redux-firebase';
import { Typography } from '@mui/material';
import { GiHamburgerMenu } from 'react-icons/all';
import { useNavigate } from 'react-router-dom';


function Topnav(props) {
    const { logout } = useFirebase();
    const navigate = useNavigate();
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
        <div className="topnav__right">
            <a className="logoutBtn" onClick={() => {
                logout().then(() => {
                    navigate('/login')
                })
            }}>
                <div className="notification-item">
                    <i className="fas fa-arrow-right-from-bracket"></i>
                    <span>Logout</span>
                </div>
            </a>
        </div>
    </div>
  );
}

export default Topnav;
