import React, { useCallback, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {
  exchangeCodeforTokens,
  getAuthenticated,
  loadAuthorizationURL,
} from './api/auth';
import Authenticated from './Authenticated';

const params = (new URL(document.location)).searchParams;
const code = params.get('code');
const initialAuthenticated = getAuthenticated();

function App() {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [authenticating, setAuthenticating] = useState(code !== null);
  useEffect(() => {
    const execute = async () => {
      window.history.replaceState({}, document.title, '/');
      try {
        await exchangeCodeforTokens(code);
        setAuthenticated(true);
      } catch (err) {
        // DO NOTHING
      }
      setAuthenticating(false);
    };
    if (!initialAuthenticated && code !== null) {
      execute();
    }
  }, []);
  const handleLoginClick = useCallback(() => {
    loadAuthorizationURL();
  }, []);
  if (authenticating) {
    return <Alert>Authenticating</Alert>;
  }
  if (!authenticated) {
    return (
      <Card>
        <Card.Body>
          <Button onClick={handleLoginClick}>Login</Button>
        </Card.Body>
      </Card>
    );
  }
  return (
    <Authenticated />
  );
}

export default App;
