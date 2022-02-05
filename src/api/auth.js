const authorizationEP = 'https://twitter.com/i/oauth2/authorize';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
const scope = 'tweet.read%20users.read%20offline.access';
const tokenEP = 'https://api.twitter.com/2/oauth2/token';

const clientId = process.env.REACT_APP_AUTH_CLIENT_ID;
const corsAnywhere = process.env.REACT_APP_AUTH_CORS_ANYWHERE;
const redirectEP = process.env.REACT_APP_AUTH_REDIRECT_EP;

const generateString = (length) => {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/** get authenticated status */
export const getAuthenticated = () => {
  const accessToken = window.localStorage.getItem('accessToken');
  return accessToken !== null;
};

/** get tokens */
export const getTokens = () => {
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken === null) {
    return null;
  }
  const refreshToken = window.localStorage.getItem('refreshToken');
  return {
    accessToken,
    refreshToken,
  };
};

/** load authorization URL */
export const loadAuthorizationURL = async () => {
  const challenge = generateString(48);
  window.localStorage.setItem('challenge', challenge);
  const authorizationURL = [
    `${authorizationEP}?`,
    'response_type=code&',
    `client_id=${clientId}&`,
    `redirect_uri=${redirectEP}&`,
    `scope=${scope}&`,
    'state=state&',
    `code_challenge=${challenge}&`,
    'code_challenge_method=plain',
  ].join('');
  window.location.assign(authorizationURL);
};

/** exchange code for tokens  */
export const exchangeCodeforTokens = async (code) => {
  const challenge = window.localStorage.getItem('challenge');
  window.localStorage.removeItem('challenge');
  const body = [
    `code=${encodeURIComponent(code)}&`,
    `grant_type=${encodeURIComponent('authorization_code')}&`,
    `client_id=${encodeURIComponent(clientId)}&`,
    `redirect_uri=${encodeURIComponent(redirectEP)}&`,
    `code_verifier=${encodeURIComponent(challenge)}`,
  ].join('');
  const response = await fetch(`${corsAnywhere}/${tokenEP}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) {
    throw Error();
  }
  // eslint-disable-next-line camelcase
  const { access_token, refresh_token } = await response.json();
  window.localStorage.setItem('accessToken', access_token);
  window.localStorage.setItem('refreshToken', refresh_token);
};

/** refresh tokens */
export const refreshTokens = async () => {
  const refreshToken = window.localStorage.getItem('refreshToken');
  const body = [
    `grant_type=${encodeURIComponent('refresh_token')}&`,
    `refresh_token=${encodeURIComponent(refreshToken)}&`,
    `client_id=${encodeURIComponent(clientId)}`,
  ].join('');
  const response = await fetch(`${corsAnywhere}/${tokenEP}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) {
    throw Error();
  }
  // eslint-disable-next-line camelcase
  const { access_token, refresh_token } = await response.json();
  window.localStorage.setItem('accessToken', access_token);
  window.localStorage.setItem('refreshToken', refresh_token);
};

/** logout */
export const logout = () => {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  window.location.reload();
};
