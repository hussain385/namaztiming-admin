import React from 'react';
import './statuscard.css';
import { FaMosque } from 'react-icons/all';

function StatusCard(props) {
  return (
    <div className="status-card">
      <div className="status-card__icon">
        {/* <i style={{ fontSize: '40px' }} className={props.icon} /> */}
        <FaMosque size={50} />
      </div>
      <div className="status-card__info">
        <h4>{props.count}</h4>
        <span>{props.title}</span>
      </div>
    </div>
  );
}

export default StatusCard;
