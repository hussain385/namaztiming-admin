import React from 'react';
import './box.css';

const BoxSignup = props => {
  return (
    <div id="card" className="animated fadeIn">
      <div id="upper-side2" style={{ backgroundColor: `${props.color}` }}>
        <i
          style={{ fontSize: '100px', marginBottom: '10px' }}
          class={props.icon}
        ></i>
        <h3 id="status">{props.value}</h3>
      </div>
      <div id="lower-side">
        <p id="message">{props.title}</p>
      </div>
    </div>
  );
};

export default BoxSignup;
