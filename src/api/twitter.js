import { getTokens, refreshTokens } from './auth';

const corsAnywhere = process.env.REACT_APP_AUTH_CORS_ANYWHERE;
const baseURL = 'https://api.twitter.com';

const getUsersByUsername = (accessToken, username) => fetch(`${corsAnywhere}${baseURL}/2/users/by/username/${username}`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});

export const usersLookup = async (username) => {
  let { accessToken } = getTokens();
  let response = await getUsersByUsername(accessToken, username);
  if (!response.ok) {
    if (response.status === 401) {
      await refreshTokens();
      ({ accessToken } = getTokens());
      response = await getUsersByUsername(accessToken, username);
    } else {
      throw Error();
    }
  }
  const { data: { id } } = await response.json();
  return id;
};

const getUsersTweets = (accessToken, userId) => fetch(`${corsAnywhere}${baseURL}/2/users/${userId}/tweets`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});

export const timeline = async (userId) => {
  let { accessToken } = getTokens();
  let response = await getUsersTweets(accessToken, userId);
  if (!response.ok) {
    if (response.status === 401) {
      await refreshTokens();
      ({ accessToken } = getTokens());
      response = await getUsersTweets(accessToken, userId);
    } else {
      throw Error();
    }
  }
  const { data: tweets } = await response.json();
  const tweetIds = tweets.map(({ id }) => id);
  return tweetIds;
};
