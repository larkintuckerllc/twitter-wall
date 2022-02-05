import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Tweet from './Tweet';
import {
  timeline,
} from './api/twitter';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }
  return newArray;
};

const getTweets = async (ids) => {
  const results = [];
  for (let i = 0; i < ids.length; i += 1) {
    results.push(timeline(ids[i]));
  }
  const timelineTweetIds = await Promise.all(results);
  let newTweets = [];
  for (let i = 0; i < ids.length; i += 1) {
    newTweets = newTweets.concat(timelineTweetIds[i]);
  }
  return shuffleArray(newTweets);
};

const setCycleInterval = (setIndex, tweets) => window.setInterval(() => {
  setIndex((prevIndex) => {
    if (prevIndex === tweets.length - 1) {
      return 0;
    }
    return prevIndex + 1;
  });
}, 20 * 1000);

// ASSUME IDS PROP DOES NOT CHANGE
function Tweets({ ids }) {
  const [tweets, setTweets] = useState([]);
  const [index, setIndex] = useState(0);
  const [errored, setErrored] = useState(false);
  useEffect(() => {
    let cycleInterval;
    let refreshInterval;
    const execute = async () => {
      try {
        let newTweets = await getTweets(ids);
        setTweets(newTweets);
        cycleInterval = setCycleInterval(setIndex, newTweets);
        refreshInterval = window.setInterval(async () => {
          clearInterval(cycleInterval);
          setIndex(0);
          newTweets = await getTweets(ids);
          setTweets(newTweets);
          cycleInterval = setCycleInterval(setIndex, newTweets);
        }, 12 * 60 * 60 * 1000);
      } catch (err) {
        clearInterval(cycleInterval);
        clearInterval(refreshInterval);
        setErrored(true);
      }
    };
    execute();
    return () => {
      clearInterval(cycleInterval);
      clearInterval(refreshInterval);
    };
  }, [ids]);

  if (errored) {
    return <Alert variant="danger">Unable to load Tweets</Alert>;
  }

  return (
    tweets.map((id) => <Tweet key={id} id={id} visible={tweets[index] === id} />)
  );
}

Tweets.propTypes = {
  ids: propTypes.arrayOf(propTypes.string).isRequired,
};

export default Tweets;
