import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { isEmpty, isLoaded, useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";

const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const ERROR = {
    color: "darkred",
    fontSize: 12,
    marginTop: -25,
    marginLeft: 50,
    marginBottom: 25,
};

const Login = (props) => {
  const { login, logout } = useFirebase();
  const { auth, profile } = useSelector((state) => state.firebase);
  const history = useHistory();

  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth)) {
      if (profile.isAdmin === false) {
        console.log("not an admin");
        logout();
      } else {
        if (props.location.state) {
          console.log("pushing to " + props.location.state.from.pathname);
          return history.push(props.location.state.from.pathname);
          // console.log(props
        }
        console.log("pushing to /");
        return history.push("/");
      }
      console.log("the current user:", auth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.isAdmin]);

  return (
    <>
      <div className="main">
        <p className="sign" align="center">
          Sign in
        </p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LogInSchema}
          onSubmit={(values, { setSubmitting }) => {
            login({
              email: values.email,
              password: values.password,
            }).then(() => {
              setSubmitting(false);
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form className="form1">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter Your Email..."
                className="un "
              />
              <br />
              {errors.email && touched.email && (
                <p style={ERROR}>{errors.email}</p>
              )}
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="pass"
                placeholder="Enter Your Password..."
              />
              <br />
              {errors.password && touched.password && (
                <p style={ERROR}>{errors.password}</p>
              )}
              {/* <a
                className="submit"
                type="submit"
                disabled={isSubmitting}
                align="center"
              >
                Sign in
              </a> */}
              <button
                onClick={handleSubmit}
                type="submit"
                className="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader type="Puff" color="white" height={12} width={40} />
                ) : (
                  <p>Submit</p>
                )}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
