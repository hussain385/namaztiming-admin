import React, { useEffect, useState } from 'react';
import './login.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card, CardHeader, Container, TextField,
} from '@mui/material';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  isEmpty, isLoaded, useFirebase, useFirestore,
} from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BoxSignUp from '../components/BoxSignup/BoxSignUp';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);
// const ERROR = {
//   color: 'darkred',
//   fontSize: 12,
//   // marginTop: -25,
//   // marginLeft: 50,
//   marginBottom: 25,
// };

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Password Confirmation is required')
    .oneOf([Yup.ref('password'), null], 'password must match'),
});

// Formik.propTypes = {
//   onSubmit: PropTypes.func,
//   initialValues: PropTypes.shape({
//     password: PropTypes.string,
//     confirmPassword: PropTypes.string,
//   }),
//   children: PropTypes.func,
// };

function SignUp() {
  // const { status, data: user, error: userError } = useUser();
  // const {
  //   userEmail, userPhone, masjidId, userName, docId,
  // } = useParams();
  const [error, setError] = useState(null);
  const firebase = useFirebase();
  const { auth, isInitializing } = useSelector(
    (state) => state.firebase,
  );
  const firestore = useFirestore();
  const { handleSubmit, control } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(SetPasswordSchema),
  });
  const [open, setOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('userEmail');
  const userPhone = searchParams.get('userPhone');
  const masjidId = searchParams.get('masjidId');
  const userName = searchParams.get('userName');
  const docId = searchParams.get('docId');

  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth)) {
      console.log('already logged in returning');
      return null;
    }
    firebase
      .auth()
      .signInWithEmailLink(userEmail, window.location.href)
      .then(async () => {
        console.log('successfully signInWithEmailLink');
      }, (reason) => setError(reason));
    return () => {};
  }, [auth]);

  const handleToast = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      return null;
    }
    // setSubmitting(true);
    const batch = firestore.batch();
    try {
      await firebase.auth().currentUser.updatePassword(values.password);
      batch.set(firestore.collection('users').doc(auth.uid), {
        name: userName,
        phone: userPhone,
        email: userEmail,
        isAdmin: false,
      });
      batch.update(
        firestore
          .collection('Masjid')
          .doc(masjidId),
        {
          adminId: auth.uid,
        },
      );
      if (docId) {
        batch.delete(
          firestore
            .collection('adminRequest')
            .doc(decodeURI(docId)),
        );
      }
      await batch.commit();
      handleToast();
      return navigate('/success-page');
    } catch (e) {
      console.log(e);
      // setSubmitting(false);
      // setFieldError('Firebase', e.message);
    }
    return null;
  };

  if (isInitializing) {
    return <span>Loading...</span>;
  }

  if (!auth) {
    if (error) {
      return (
        <BoxSignUp
          value="Link Invalid"
          icon="far fa-times-circle"
          color="#c34a4a"
          title="This can happen if the link is malformed, expired, or has already been used."
        />
      );
    }
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
    isLoaded(auth)
        && !isEmpty(auth)
  ) {
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
        <Card
          component="form"
          onSubmit={handleSubmit(onSubmit)}
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
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                margin="normal"
                label="Password"
                name="password"
                type="password"
                ref={field.ref}
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <TextField
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                ref={field.ref}
                onChange={field.onChange}
                value={field.value}
                onBlur={field.onBlur}
                error={Boolean(fieldState.error?.message)}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          {/* {errors.Firebase && ( */}
          {/* <Typography style={ERROR}>{errors.Firebase}</Typography> */}
          {/* )} */}
          <LoadingButton
            type="submit"
            variant="contained"
            // loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Card>
      </Container>
    );
  }

  return (
    <BoxSignUp
      value="Loading"
      icon="far fa-clock"
      color="#becc00"
      title="Please wait while we proceed / Something Went wrong please check your link"
    />
  );
}

export default SignUp;
