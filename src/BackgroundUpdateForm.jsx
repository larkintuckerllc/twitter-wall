import React from 'react';
import { useFormik } from 'formik';
import propTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function BackgroundUpdateForm({ initialBackground, onSubmit }) {
  const formik = useFormik({
    initialValues: {
      background: initialBackground,
    },
    onSubmit: ({ background }) => {
      onSubmit(background);
    },
  });

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="background">
            <Form.Label>background</Form.Label>
            <Form.Control
              type="text"
              onChange={formik.handleChange}
              placeholder="Enter background"
              value={formik.values.background}
            />
          </Form.Group>
          <Button type="submit">
            Update
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

BackgroundUpdateForm.propTypes = {
  initialBackground: propTypes.string.isRequired,
  onSubmit: propTypes.func.isRequired,
};

export default BackgroundUpdateForm;
