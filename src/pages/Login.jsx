import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './login.css';
import { isEmpty, isLoaded, useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import ThemeAction from '../redux/actions/ThemeAction';

const LogInSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const ERROR = {
  color: 'darkred',
  fontSize: 12,
  marginTop: -25,
  marginLeft: 50,
  marginBottom: 25,
};

function Login(props) {
  console.log(props);
  const { login, logout } = useFirebase();
  const { auth, profile, isInitializing } = useSelector(
    state => state.firebase,
  );
  const navigate = useNavigate();

  const themeReducer = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem('themeMode', 'theme-mode-light');
    const colorClass = localStorage.getItem('colorMode', 'theme-mode-light');
    dispatch(ThemeAction.setMode(themeClass));
    dispatch(ThemeAction.setColor(colorClass));
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth)) {
      if (profile.isAdmin === false) {
        console.log('not an admin');
        return logout();
      } else {
        // if (props?.location.state) {
        //   console.log('pushing to ' + props.location.state.from.pathname);
        //   return history.push(props.location.state.from.pathname);
        //   // console.log(props
        // }
        console.log('pushing to /');

        if (!isInitializing) {
          return navigate('/', { replace: true });
        }
      }
    }
  }, [profile.isAdmin]);

  return (
    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
      <div className="main_body">
        <div className="main">
          <p className="sign" align="center">
            Sign in
          </p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LogInSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              login({
                email: values.email,
                password: values.password,
              }).then(
                () => {
                  setSubmitting(false);
                },
                reason => {
                  setSubmitting(false);
                  setFieldError('firebase', reason.message);
                },
              );
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
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="pass"
                  placeholder="Enter Your Password..."
                />
                <br />
                {/*{JSON.stringify(values,null,2)}*/}
                {errors.password && touched.password && (
                  <p style={ERROR}>{errors.password}</p>
                )}
                {errors.firebase && <p style={ERROR}>{errors.firebase}</p>}
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
      </div>
    </div>
  );
}

export default Login;
