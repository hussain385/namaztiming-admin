import React from 'react';
import './box.css';
import PropTypes from 'prop-types';

function BoxSignup({ icon, value, color, title }) {
  return (
    <div id="card" className="animated fadeIn">
      <div id="upper-side2" style={{ backgroundColor: `${color}` }}>
        <i
          style={{ fontSize: '100px', marginBottom: '10px' }}
          className={icon}
        />
        <h3 id="status">{value}</h3>
      </div>
      <div id="lower-side">
        <p id="message">{title}</p>
      </div>
    </div>
  );
}

BoxSignup.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default BoxSignup;
