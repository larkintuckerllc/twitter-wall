import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import styles from './tweet.module.css';

function Tweet({ id, visible }) {
  const [slot, setSlot] = useState(null);
  useEffect(() => {
    const randomSlot = Math.floor(Math.random() * 4);
    setSlot(randomSlot);
  }, []);
  let divStyle = {};
  switch (slot) {
    case 0:
      divStyle = { left: '20%' };
      break;
    case 1:
      divStyle = { left: '35%' };
      break;
    case 2:
      divStyle = { right: '35%' };
      break;
    case 3:
      divStyle = { right: '20%' };
      break;
    default:
      divStyle = { opacity: '0%' };
  }
  const classes = visible
    ? `${styles.root} ${styles.rootVisible}`
    : styles.root;

  return (
    <div className={classes} style={divStyle}>
      <TwitterTweetEmbed tweetId={id} />
    </div>
  );
}

Tweet.propTypes = {
  id: propTypes.string.isRequired,
  visible: propTypes.bool.isRequired,
};

export default Tweet;
