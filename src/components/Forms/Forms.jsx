import React from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Loader from 'react-loader-spinner';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { sendNotification } from '../../services/pushNotification';

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

const schema = Yup.object().shape({
  userEmail: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  userName: Yup.string().required('Name is required'),
  userPhone: Yup.string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      'Phone number is not valid',
    )
    .min(11, 'phone no. is short, please check again')
    .max(16, 'phone no. is long, please check again')
    .required('Your Phone no. is required'),
});

function Forms({ item, handleToast, closeModal }) {
  const firestore = useFirestore();
  const firebase = useFirebase();

  console.log(
    item.masjid.id,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userEmail: `${item.userEmail}`,
      userName: `${item.userName}`,
      userPhone: `${item.userPhone}`,
    },
    resolver: yupResolver(schema),
  });
  console.log(errors);

  const submit = async (data) => {
    console.log('clicked on submit');
    if (item.masjid?.adminId) {
      if (
        window.confirm(
          'This masjid already have a admin. Do you want to continue?',
        )
      ) {
        await firestore
          .update(`Masjid/${item.masjid.id}`, {
            adminId: firestore.FieldValue.delete(),
          })
          .then(() => {
            handleToast();
          });
      } else return null;
    }
    // const newAdmin = 1;
    // const existingAdmin = 1;
    console.log('sending link...');
    // if (newAdmin === existingAdmin) {
    //   emailjs
    //     .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data, 'YOUR_USER_ID')
    //     .then(
    //       result => {
    //         console.log(result.text);
    //       },
    //       error => {
    //         console.log(error.text);
    //       },
    //     );
    //   return null;
    // }
    // setSubmitting(true);
    const actionCodeSettings = {
      url: encodeURI(
        `https://namaz-timings-pakistan.netlify.app/SignUp?userName=${data.userName}&userPhone=${data.userPhone}&masjidId=${item.masjid.id}&userEmail=${data.userEmail}&docId=${item.id}`,
      ),
      handleCodeInApp: true,
      dynamicLinkDomain: 'namaztimings.page.link',
    };
    await firebase
      .auth()
      .sendSignInLinkToEmail(data.userEmail, actionCodeSettings)
      .then(() => {
        console.log('link sent!!!');
        closeModal();
        // setSubmitting(false);
        handleToast();
      });
    if (item.token) {
      await sendNotification(
        item.token,
        'Admin request has been approved',
        `Congratulations you are now admin of ${item.masjid?.name} please check your email`,
      );
    }
  };

  return (
    <>
      <div
        style={{
          height: '50vh',
          overflowY: 'auto',
          paddingRight: 10,
          paddingLeft: 10,
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Admin Request</h1>
        <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Name</p>
        <input
          style={INPUT}
          placeholder="Enter Your Name..."
          {...register('userName', { required: true })}
        />
        {errors.userName && <p style={ERROR}>{errors.userName?.message}</p>}
        <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Email</p>
        <input
          style={INPUT}
          placeholder="Enter Your Email..."
          {...register('userEmail', { required: true })}
        />
        {errors.userEmail && <p style={ERROR}>{errors.userEmail?.message}</p>}
        <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Phone Number</p>
        <input
          style={INPUT}
          placeholder="Enter Your Phone Number..."
          {...register('userPhone', { required: true })}
        />
        {errors.userPhone && <p style={ERROR}>{errors.userPhone?.message}</p>}
      </div>
      <p>{item.masjid?.name}</p>
      <p>{item.masjid?.address}</p>
      {item.masjid?.adminId && <p style={ERROR}>Already Have an Admin</p>}
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
          onClick={closeModal}
        >
          Close
        </button>
        {/* <input */}
        {/*  type="submit" */}
        {/*  style={{ */}
        {/*    paddingRight: 10, */}
        {/*    paddingLeft: 10, */}
        {/*    color: 'white', */}
        {/*    backgroundColor: 'green', */}
        {/*    borderRadius: 7, */}
        {/*    height: 30, */}
        {/*  }} */}
        {/* /> */}
        <button
          style={{
            paddingRight: 10,
            paddingLeft: 10,
            color: 'white',
            backgroundColor: 'green',
            borderRadius: 7,
            height: 30,
          }}
          disabled={isSubmitting}
          onClick={handleSubmit(submit)}
        >
          {isSubmitting ? (
            <Loader type="Puff" color="white" height={12} width={40} />
          ) : (
            <p>Accept Request</p>
          )}
        </button>
      </div>
    </>
    // </form>
  );
}

export default Forms;
