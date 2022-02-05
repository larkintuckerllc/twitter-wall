import React from 'react';
import propTypes from 'prop-types';
import styles from './background.module.css';

function Background({ background }) {
  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: `url("${background}")`,
      }}
    />
  );
}

Background.propTypes = {
  background: propTypes.string.isRequired,
};

export default Background;
