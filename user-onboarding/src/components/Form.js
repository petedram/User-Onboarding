import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
    Container, Row, Card, CardText, CardBody, CardHeader, Col
  } from 'reactstrap';


const UserForm = ({ values, errors, touched, status }) => {
  console.log("values", values);
  console.log("errors", errors);
  console.log("touched", touched);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    status && setUsers(users => [...users, status]);
  }, [status]);
  return (
    <div className="team-form">
      <Form>
        <label htmlFor="name">
          Name
          <Field
            id="name"
            type="text"
            name="name"
            placeholder="name"
          />
         
          {touched.name && errors.name && (
            <p className="errors">{errors.name}</p>
          )}
        </label>

        <label htmlFor="email">
          Email
          <Field id="email" type="text" name="email" placeholder="email" />
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </label>
       
        <label htmlFor="password">
          Password
          <Field id="password" type="text" name="password" placeholder="password" />
          {touched.password && errors.password && (
            <p className="errors">{errors.password}</p>
          )}
        </label>

        <label className="checkbox-container">
          Terms of Service
          <Field
            type="checkbox"
            name="tos"
            checked={values.tos}
          />
            {touched.tos && errors.tos && (
            <p className="errors">{errors.tos}</p>
          )}
          <span className="checkmark" />
        </label>
        <button type="submit">Submit!</button>
      </Form>
      {users.map(users => {
        return (
            <div className='user-list' key={users.id}>
                <Container>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>Name: {users.name}</CardHeader>
                            <CardBody><CardText>Email: {users.email}</CardText></CardBody>
                        </Card>
                    </Col>
                </Row>
                </Container>

            </div>
        );
      })}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues(props) {
    return {
        name: props.name || "",
        email: props.email || "",
        password: props.password || "",
        tos: props.tos || false,
    };
  },

    validationSchema: Yup.object().shape({
        name: Yup.string().min(2, 'Name too short!').required('Please enter name'),
        email: Yup.string().email('Invalid Email').required("Please provide a valid email address"),
        password: Yup.string().required("Please provide a password"),
        tos: Yup.bool().oneOf([true], "Pleaase confirm you have read our Terms and Conditions")
    }),

    handleSubmit(values, { setStatus, resetForm }) {
        console.log("submitting", values);
        axios
        .post("https://reqres.in/api/users/", values)
        .then(res => {
            console.log("success", res);
            setStatus(res.data);
            resetForm();
        })
        .catch(err => console.log(err.response));
    }
})(UserForm);
export default FormikUserForm;
