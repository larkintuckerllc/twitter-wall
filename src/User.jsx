import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';

function User({ id, onDelete, username }) {
  const handleClick = useCallback(() => {
    onDelete(id);
  }, [id]);

  return (
    <ListGroup.Item action onClick={handleClick}>
      {username}
    </ListGroup.Item>
  );
}

User.propTypes = {
  id: propTypes.string.isRequired,
  onDelete: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
};

export default User;
