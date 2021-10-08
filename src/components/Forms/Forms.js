import { Formik } from 'formik';
import React from 'react';
import firebase from 'firebase/compat';
import * as Yup from 'yup';
import { useFirestore } from 'react-redux-firebase';
import Loader from 'react-loader-spinner';

const ERROR = {
  color: 'darkred',
  fontSize: 12,
  marginTop: 5,
};

const INPUT = {
  borderRadius: 5,
  padding: 10,
  backgroundColor: '#eeee',
  width: '100%',
};

const Forms = props => {
  const firestore = useFirestore();
  return (
    <Formik
      initialValues={{
        userEmail: `${props.item.userEmail}`,
        userName: `${props.item.userName}`,
        userPhone: `${props.item.userPhone}`,
      }}
      validationSchema={Yup.object().shape({
        userEmail: Yup.string().email().required('Email is required'),
        userName: Yup.string().required('Name is required'),
        userPhone: Yup.string()
          .matches(
            /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
            'Phone number is not valid',
          )
          .min(11, 'phone no. is short, please check again')
          .max(16, 'phone no. is long, please check again')
          .required('Your Phone no. is required'),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        if (props.item.masjid?.adminId) {
          if (
            window.confirm(
              'This masjid already have a admin. Do you want to continue?',
            )
          ) {
            firestore.update('Masjid/' + props.item.masjid.id, {
              adminId: firestore.FieldValue.delete(),
            });
          } else return null;
        }
        setSubmitting(true);
        const actionCodeSettings = {
          url: encodeURI(
            `https://masjid-finder-pakistan.web.app/SignUp?userName=${values.userName}&userPhone=${values.userPhone}&masjidId=${props.item.masjid.id}&userEmail=${values.userEmail}`,
          ),
          handleCodeInApp: true,
          dynamicLinkDomain: 'namaztimings.page.link',
        };
        await firebase
          .auth()
          .sendSignInLinkToEmail(values.userEmail, actionCodeSettings)
          .then(value => {
            props.closeModal();
            setSubmitting(false);
            props.handleToast();
          });
      }}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting,
        /* and other goodies */
      }) => (
        <>
          <div
            style={{
              height: '50vh',
              overflowY: 'auto',
              paddingRight: 10,
            }}
          >
            <h1 style={{ textAlign: 'center' }}>Admin Request</h1>
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Name</p>
            <input
              onChange={handleChange('userName')}
              value={values.userName}
              onBlur={handleBlur('userName')}
              style={INPUT}
              placeholder="Enter Your Name..."
            />
            {errors.userName && touched.userName && (
              <p style={ERROR}>{errors.userName}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Email</p>
            <input
              onChange={handleChange('userEmail')}
              value={values.userEmail}
              onBlur={handleBlur('userEmail')}
              style={INPUT}
              placeholder="Enter Your Email..."
            />
            {errors.userEmail && touched.userEmail && (
              <p style={ERROR}>{errors.userEmail}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Phone Number</p>
            <input
              onChange={handleChange('userPhone')}
              value={values.userPhone}
              onBlur={handleBlur('userPhone')}
              style={INPUT}
              placeholder="Enter Your Phone Number..."
            />
            {errors.userPhone && touched.userPhone && (
              <p style={ERROR}>{errors.userPhone}</p>
            )}
          </div>
          <p>{props.item.masjid?.name}</p>
          <p>{props.item.masjid?.address}</p>
          {props.item.masjid?.adminId && (
            <p style={ERROR}>Already Have an Admin</p>
          )}
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              justifyContent: 'flex-end',
            }}
          >
            <button
              style={{
                width: 70,
                color: 'white',
                borderRadius: 7,
                height: 30,
                marginRight: 20,
                backgroundColor: 'darkred',
              }}
              onClick={props.closeModal}
            >
              Close
            </button>
            <button
              style={{
                paddingRight: 10,
                paddingLeft: 10,
                color: 'white',
                backgroundColor: 'green',
                borderRadius: 7,
                height: 30,
              }}
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Loader type="Puff" color="white" height={12} width={40} />
              ) : (
                <p>Accept Request</p>
              )}
            </button>
          </div>
        </>
      )}
    </Formik>
  );
};

export default Forms;
