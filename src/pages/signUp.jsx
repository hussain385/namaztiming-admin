import React, { useEffect, useMemo, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Redirect from 'react-dom';
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirestore,
} from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import BoxSignUp from '../components/BoxSignup/BoxSignUp';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
const ERROR = {
  color: 'darkred',
  fontSize: 12,
  // marginTop: -25,
  // marginLeft: 50,
  marginBottom: 25,
};

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password'), null], 'password must match'),
});

Formik.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.shape({
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }),
  children: PropTypes.func,
};

function SignUp() {
  // const { status, data: user, error: userError } = useUser();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const [error, setError] = useState(null);
  const firebase = useFirebase();
  const { auth, profile, isInitializing } = useSelector(
    (state) => state.firebase,
  );
  const firestore = useFirestore();
  const history = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth)) {
      console.log('already logged in returning');
      return null;
    }
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = params.get('userEmail') || '';
      }
      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(async () => {
          console.log('successfully signInWithEmailLink');
          // Clear email from storage.
          // const token = await result.user.getIdToken(true)
          // await firebase.auth().signOut()
          // console.log(token, result.user.email)
          // await login({
          //     // email: result.user.email,
          //     token,
          //     profile: {email: result.user.email}
          // })

          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error1) => {
          console.error(error1.message);
          setError(error1.message);
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
    return () => {};
  }, [auth, firebase, params]);

  // function resetAndRoute() {
  //     firebase.auth().sendPasswordResetEmail(user.email).then(r => {
  //         history.push('/forgotPassword')
  //     })
  // }

  if (error && !auth) {
    return (
      <BoxSignUp
        value="Link Invalid"
        icon="far fa-times-circle"
        color="#c34a4a"
        title="This can happen if the link is malformed, expired, or has already been used."
      />
    );
  }

  if (isInitializing) {
    return <span>Loading...</span>;
  }

  // if (status === 'error') {
  //   return (
  //     <BoxSignup
  //       value="Please try again"
  //       icon="far fa-times-circle"
  //       color="#c34a4a"
  //       title="Error! Something went wrong please try again"
  //     />
  //   );
  // }

  if (!auth) {
    return (
      <BoxSignUp
        value="Please try again"
        icon="far fa-times-circle"
        color="#c34a4a"
        title="error"
      />
    );
  }

  if (
    params.get('userName')
    && params.get('userPhone')
    && params.get('masjidId')
    && isLoaded(auth)
    && !isEmpty(auth)
  ) {
    // db.collection('users')
    //   .doc(user.uid)
    //   .get()
    //   .then(value => {
    //     console.log(value);
    if (isLoaded(profile) && !isEmpty(profile)) {
      console.log('exist', auth, profile);
      const batch = firestore.batch();

      batch.update(
        firestore.collection('Masjid').doc(decodeURI(params.get('masjidId'))),
        {
          adminId: auth.uid,
        },
      );

      batch.delete(
        firestore
          .collection('adminRequest')
          .doc(decodeURI(params.get('docId'))),
      );
      batch
        .commit()
        .then(() => {
          history('/success-page');
        })
        .catch((reason) => {
          console.error(reason);
        });
    }
    //   });
    return (
      <Container
        component="main"
        maxWidth="xs"
        sx={{ display: 'flex', height: '100vh' }}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          autoHideDuration={1500}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Successfully password saved!
          </Alert>
        </Snackbar>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SetPasswordSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            if (values.password !== values.confirmPassword) {
              return null;
            }
            setSubmitting(true);
            const batch = firestore.batch();
            try {
              await firebase.auth().currentUser.updatePassword(values.password);
              batch.set(firestore.collection('users').doc(auth.uid), {
                name: decodeURI(params.get('userName')),
                phone: decodeURI(params.get('userPhone')),
                email: decodeURI(params.get('userEmail')),
                isAdmin: false,
              });
              batch.update(
                firestore
                  .collection('Masjid')
                  .doc(decodeURI(params.get('masjidId'))),
                {
                  adminId: auth.uid,
                },
              );
              const docId = params.get('docId');
              if (docId) {
                batch.delete(
                  firestore
                    .collection('adminRequest')
                    .doc(decodeURI(docId)),
                );
              }
              await batch.commit();
              handleToast();
              setSubmitting(false);
              return <Redirect to="/success-page" />;
            } catch (e) {
              setSubmitting(false);
              setFieldError('Firebase', e.message);
            }
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
            <Card
              component={Form}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
                width: '100%',
                alignItems: 'center',
                p: 4,
                borderRadius: '10px',
              }}
            >
              <CardHeader title="Set Your Password" />
              <TextField
                margin="normal"
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />
              <TextField
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
              />
              {errors.Firebase && (
                <Typography style={ERROR}>{errors.Firebase}</Typography>
              )}
              <LoadingButton
                onClick={handleSubmit}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Submit
              </LoadingButton>
            </Card>
          )}
        </Formik>
      </Container>
    );
  }

  return (
    // <Container>
    <BoxSignUp
      value="Loading"
      icon="far fa-clock"
      color="#becc00"
      title="Please wait while we proceed / Something Went wrong please check your link"
    />
    /* <Typography>Something Went wrong please check your link</Typography> */
    /* </Container> */
  );
}

export default SignUp;
