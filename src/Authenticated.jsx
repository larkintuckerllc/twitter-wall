import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import { logout } from './api/auth';
import { removeBackground, retrieveBackground, storeBackground } from './api/background';
import { removeUsers, retrieveUsers, storeUsers } from './api/users';
import Background from './Background';
import Tweets from './Tweets';
import User from './User';
import BackgroundUpdateForm from './BackgroundUpdateForm';
import UserAddForm from './UserAddForm';
import styles from './authenticated.module.css';

function Authenticated() {
  const initialBackground = retrieveBackground();
  const initialUsers = retrieveUsers();
  const [background, setBackground] = useState(
    initialBackground !== undefined ? initialBackground : null,
  );
  const [users, setUsers] = useState(initialUsers || []);
  const [playing, setPlaying] = useState(false);
  const handleUserAddSubmit = useCallback((user) => {
    setUsers((prevUsers) => {
      if (prevUsers.find((u) => u.id === user.id)) {
        return prevUsers;
      }
      const nextUsers = [...prevUsers, user];
      storeUsers(nextUsers);
      return nextUsers;
    });
  }, []);
  const handleBackgroundUpdateSubmit = useCallback((nextBackground) => {
    if (nextBackground === '') {
      removeBackground();
      setBackground(null);
      return;
    }
    storeBackground(nextBackground);
    setBackground(nextBackground);
  }, []);
  const handleStartPlayingClick = useCallback(() => {
    setPlaying(true);
  }, []);
  const handleStopPlayingClick = useCallback(() => {
    setPlaying(false);
  }, []);
  const handleLogooutClick = useCallback(() => {
    removeBackground();
    removeUsers();
    logout();
  }, []);
  const handleDelete = useCallback(
    (id) => {
      setUsers((prevUsers) => {
        const newUsers = prevUsers.filter((user) => user.id !== id);
        storeUsers(newUsers);
        return newUsers;
      });
    },
    [],
  );

  if (!playing) {
    return (
      <Card>
        <Card.Body>
          <Stack gap={3}>
            <BackgroundUpdateForm
              initialBackground={background !== null ? background : ''}
              onSubmit={handleBackgroundUpdateSubmit}
            />
            <UserAddForm onSubmit={handleUserAddSubmit} />
            <ListGroup>
              {users.map((user) => (
                <User
                  key={user.id}
                  id={user.id}
                  username={user.username}
                  onDelete={handleDelete}
                />
              ))}
            </ListGroup>
            <Stack direction="horizontal" gap={3}>
              {users.length !== 0 && (
                <Button onClick={handleStartPlayingClick}>Start Playing</Button>
              )}
              <Button onClick={handleLogooutClick}>Logout</Button>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div
      className={styles.root}
      onClick={handleStopPlayingClick}
      onKeyPress={handleStopPlayingClick}
      role="button"
      tabIndex={0}
    >
      { background !== null && <Background background={background} /> }
      <Tweets ids={users.map(({ id }) => id)} />
    </div>
  );
}

export default Authenticated;
