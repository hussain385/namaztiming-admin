import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import './sidebar.css';
import {
  FaInbox, FaRegAddressCard, FaRegBuilding,
  FaBell, FaRegClock, FaRegHourglass, FaRegLightbulb, FaRegStickyNote,
} from 'react-icons/all';

// import logo from '../../assets/images/logo.png'

const sideBarItems = [
  {
    display_name: 'Dashboard',
    route: '/',
    icon: <FaRegHourglass />,
  },
  {
    display_name: 'Masjid List',
    route: '/masjidList',
    icon: <FaRegLightbulb />,
  },
  {
    display_name: 'New Masjid Request',
    route: '/request',
    icon: <FaInbox />,
  },
  {
    display_name: 'Admin Request',
    route: '/admin-request',
    icon: <FaRegStickyNote />,
  },
  {
    display_name: 'Add Masjid',
    route: '/add-masjid',
    icon: <FaRegBuilding />,
  },
  {
    display_name: 'Edit Time Requests',
    route: '/time-requests',
    icon: <FaRegClock />,
  },
  {
    display_name: 'Contact Us',
    route: '/contact-us',
    icon: <FaRegAddressCard />,
  },
  {
    display_name: 'Group Announcement',
    route: '/group-announcement',
    icon: <FaBell />,
  },
];

function SidebarItem(props) {
  const active = props.active ? 'active' : '';

  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        {props.icon}
        <span>{props.title}</span>
      </div>
    </div>
  );
}

function Sidebar(props) {
  const { pathname } = useLocation();
  console.log(pathname);
  const activeItem = sideBarItems.findIndex((item) => item.route === pathname);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">Namaz Timings</div>
      {sideBarItems.map((item, index) => (
        <Link onClick={() => props.clickOpen()} to={item.route} key={index}>
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;
