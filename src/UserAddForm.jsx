import React from 'react';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { usersLookup } from './api/twitter';

function UserAddForm({ onSubmit }) {
  const formik = useFormik({
    initialValues: {
      username: '',
    },
    onSubmit: async ({ username }, { resetForm, setStatus, setSubmitting }) => {
      setStatus({});
      try {
        const id = await usersLookup(username);
        onSubmit({
          username,
          id,
        });
        resetForm();
      } catch (err) {
        setStatus({ failed: true });
        setSubmitting(false);
      }
    },
  });

  return (
    <Card>
      <Card.Body>
        {formik.isSubmitting && <Alert>Submitting</Alert>}
        {formik.status && formik.status.failed && (
          <Alert variant="danger">Failed to add</Alert>
        )}
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>username</Form.Label>
            <Form.Control
              disabled={formik.isSubmitting}
              type="text"
              onChange={formik.handleChange}
              placeholder="Enter username"
              value={formik.values.username}
            />
          </Form.Group>
          <Button disabled={formik.isSubmitting} type="submit">
            Add
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

UserAddForm.propTypes = {
  onSubmit: propTypes.func.isRequired,
};

export default UserAddForm;
