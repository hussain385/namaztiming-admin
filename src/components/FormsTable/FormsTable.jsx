import React, { useState } from 'react';
import { useFirebase, useFirestore, useFirestoreConnect } from 'react-redux-firebase';
import { Field, Formik } from 'formik';
import { LocalizationProvider, MobileTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import {
  Autocomplete, Box, Grid, TextField,
} from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import geohash from 'ngeohash';
import { useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { init, send } from '@emailjs/browser';
import { MasjidSchema } from '../../services/validation';
import { sendNotification } from '../../services/pushNotification';

init('JYbAB8P623mTkLgvV');

const ERROR = {
  color: 'darkred',
  fontSize: 12,
  marginTop: 5,
};

function FormsTable(props) {
  const [loading1, setLoading1] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  useFirestoreConnect([
    {
      collection: 'users',
    },
  ]);

  // const {masjidData, preButton: {onClick: preButtonClick, text: preButtonText}, onSubmit} = props
  const masjidData = props.masjidData || null;
  const firebase = useFirebase();
  const filePath = 'MasjidUploads';
  const [image, setImage] = useState(masjidData?.pictureURL);
  const firestore = useFirestore();
  const users = useSelector((state) => state.firestore.ordered.users);
  const loading = users ? users.length === 0 : true;
  const [edit, setEdit] = useState(false);

  const onImageChange = async (event, setFieldValue) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
      setFieldValue('pictureURL', event.target.files[0]);
    }
  };

  function onFileDelete(setFieldValue) {
    if (!(masjidData.pictureURL instanceof File)) {
      // firebase.storage()
      return firebase.deleteFile(masjidData.pictureURL).then(() => {
        setFieldValue('pictureURL', '');
        setImage('');
      });
    }
    setImage('');
  }

  return (
    <Formik
      initialValues={{
        name: masjidData?.name || '',
        address: masjidData?.address || '',
        gLink: masjidData?.gLink || '',
        pictureURL: masjidData?.pictureURL || '',
        userEmail: masjidData?.user?.email || masjidData?.userEmail || '',
        userName: masjidData?.user?.name || masjidData?.userName || '',
        userPhone: masjidData?.user?.phone || masjidData?.userPhone || '',
        latitude: masjidData?.g?.geopoint._lat || '',
        longitude: masjidData?.g?.geopoint._long || '',
        timing: {
          isha: masjidData?.timing?.isha || null,
          fajar: masjidData?.timing?.fajar || null,
          zohar: masjidData?.timing?.zohar || null,
          asar: masjidData?.timing?.asar || null,
          magrib: masjidData?.timing?.magrib || null,
          jummah: masjidData?.timing?.jummah || null,
          eidUlAddah: masjidData?.timing?.eidUlAddah || null,
          eidUlFitr: masjidData?.timing?.eidUlFitr || null,
        },
      }}
      validationSchema={MasjidSchema}
      validateOnChange={false}
      validateOnBlur
      onSubmit={async (values, { resetForm }) => {
        setSubmitting(true);
        console.log(isSubmitting, 'sanas');
        const filter = [
          'latitude',
          'longitude',
          'pictureURL',
          'userName',
          'userEmail',
          'userPhone',
          'token',
        ];
        const data = _.omit(values, filter);
        let pictureURL;
        if (values.pictureURL instanceof File) {
          try {
            const uploadedRef = await firebase.uploadFile(
              filePath,
              values.pictureURL,
            );
            pictureURL = await uploadedRef.uploadTaskSnaphot.ref.getDownloadURL();
          } catch (e) {
            console.error(e);
          }
        } else {
          pictureURL = values.pictureURL;
        }
        if (props.variant === 'new' || props.variant === 'request') {
          firestore
            .add('Masjid', {
              ...data,
              pictureURL,
              g: {
                geopoint: new firestore.GeoPoint(
                  values.latitude,
                  values.longitude,
                ),
                geohash: geohash.encode(values.latitude, values.longitude, 9),
              },
              timeStamp: firestore.Timestamp.now(),
            })
            .then(async (value2) => {
              if (props.variant === 'new' && values.userEmail) {
                const actionCodeSettings = {
                  url: encodeURI(
                    `https://namaz-timings-pakistan.netlify.app/SignUp?userName=${values.userName}&userPhone=${values.userPhone}&masjidId=${value2.id}&userEmail=${values.userEmail}`,
                  ),
                  handleCodeInApp: true,
                  dynamicLinkDomain: 'namaztimings.page.link',
                };
                await firebase
                  .auth()
                  .sendSignInLinkToEmail(values.userEmail, actionCodeSettings);
              }
              if (props.variant === 'request') {
                await send('service_6htulue', 'template_nwbvmks', {
                  message: `This ${masjidData.name} has been approved by admin. PLease send a admin request if you want to be an admin to this masjid`,
                  reply_to: values.userEmail,
                  type: 'Admin Changes',
                });
                await firestore
                  .delete({ collection: 'newMasjid', doc: masjidData.id })
                  .then(async () => {
                    if (masjidData.token) {
                      await sendNotification(
                        masjidData.token,
                        'Masjid has been added',
                        'Your request for new Masjid has been approved',
                      );
                    }
                    setSubmitting(false);
                    props.preButton?.onClick();
                  });
              }
              resetForm({ values: '' });
              setImage('');
              setSubmitting(false);
              props.handleToast();
            });
        } else if (props.variant === 'edit') {
          const user = _.find(users, (u) => u.email === values.userEmail);
          // console.log(user, 'the user we get');
          firestore
            .update(`Masjid/${masjidData.id}`, {
              adminId: user?.id || '',
              ...data,
              pictureURL,
              g: {
                geopoint: new firestore.GeoPoint(
                  values.latitude,
                  values.longitude,
                ),
                geohash: geohash.encode(values.latitude, values.longitude, 9),
              },
              timeStamp: firestore.Timestamp.now(),
            })
            .then(async () => {
              props.preButton?.onClick();
              setSubmitting(false);
              props.handleToast();
              if (masjidData.tokens) {
                for (let token of masjidData.tokens) {
                  sendNotification(
                      token,
                      masjidData.name,
                      'Info is updated by admin',
                  ).then(
                      value => {
                        console.log(value);
                      },
                      reason => {
                        console.error(reason);
                      },
                  );
                }
              }
              const user = _.find(users, (u) => u.email === values.userEmail);
              if (user) {
                await send('service_6htulue', 'template_nwbvmks', {
                  message: `This ${values.name} has been added to your account`,
                  reply_to: user.email,
                  type: 'Admin Changes',
                });
              } else {
                console.log(values.userEmail, values.userName, masjidData.id)
                const actionCodeSettings = {
                  url: encodeURI(
                      `https://namaz-timings-pakistan.netlify.app/SignUp?userName=${values.userName}&userPhone=${values.userPhone}&masjidId=${masjidData.id}&userEmail=${values.userEmail}`,
                  ),
                  handleCodeInApp: true,
                  dynamicLinkDomain: 'namaztimings.page.link',
                };
                await firebase
                    .auth()
                    .sendSignInLinkToEmail(values.userEmail, actionCodeSettings);
              }
            });
        }
      }}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
        setFieldValue,
        /* and other goodies */
      }) => (
        <>
          <Grid
            style={{
              height: '70vh',
              overflowY: 'scroll',
              paddingRight: 10,
            }}
            spacing={2}
            container
          >
            <Grid item xs={12} md={6}>
              <TextField
                label="Masjid Name"
                name="name"
                value={values.name}
                onChange={(event) => {
                  setFieldValue('name', event.target.value);
                }}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                fullWidth
                options={users || []}
                loading={loading}
                onChange={(event, value) => {
                  if (!value) {
                    return setFieldValue('userName', '');
                  }
                  if (value.name) {
                    setFieldValue('userName', value.name);
                    setFieldValue('userPhone', value.phone);
                    setFieldValue('userEmail', value.email);
                  } else {
                    setFieldValue('userName', value);
                  }
                }}
                onInputChange={(event, value) => {
                  setFieldValue('userName', value);
                }}
                getOptionLabel={(option) => {
                  if (option.name) {
                    return option.name;
                  }
                  return option;
                }}
                value={values.userName}
                disabled={
                                    (masjidData?.user?.name || masjidData?.userName) && !edit
                                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Admin Name"
                    name="userName"
                    error={touched.userName && Boolean(errors.userName)}
                    helperText={touched.userName && errors.userName}
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                fullWidth
                options={users || []}
                loading={loading}
                disabled={
                                    (masjidData?.user?.email || masjidData?.userEmail)
                                }
                onChange={(event, value) => {
                  if (!value) {
                    return setFieldValue('userEmail', '');
                  }
                  if (value.email) {
                    setFieldValue('userName', value.name);
                    setFieldValue('userPhone', value.phone);
                    setFieldValue('userEmail', value.email);
                  } else {
                    setFieldValue('userEmail', value);
                  }
                }}
                onInputChange={(event, value) => {
                  setFieldValue('userEmail', value);
                }}
                getOptionLabel={(option) => {
                  if (option.email) {
                    return option.email;
                  }
                  return option;
                }}
                value={values.userEmail}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Admin Email"
                    name="userEmail"
                    error={touched.userEmail && Boolean(errors.userEmail)}
                    helperText={touched.userEmail && errors.userEmail}
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Admin Phone."
                name="userPhone"
                disabled={
                                    (masjidData?.user?.phone || masjidData?.userPhone)
                                }
                value={values.userPhone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userPhone && Boolean(errors.userPhone)}
                helperText={touched.userPhone && errors.userPhone}
                fullWidth
              />
            </Grid>
            {!(
              _.isUndefined(masjidData?.user?.email)
                            && _.isUndefined(masjidData?.userEmail)
            ) && (
            <Grid item xs={12}>
              <button
                style={{
                  width: 70,
                  color: 'white',
                  borderRadius: 7,
                  height: 30,
                  marginRight: 20,
                  backgroundColor: 'green',
                }}
                onClick={() => setEdit((prevState) => !prevState)}
                type="button"
              >
                {edit ? 'Cancel' : 'Edit'}
              </button>
              <button
                style={{
                  width: 70,
                  color: 'white',
                  borderRadius: 7,
                  height: 30,
                  marginRight: 20,
                  backgroundColor: 'darkred',
                }}
                onClick={() => {
                  setLoading1(true);
                  if (props.variant === 'request') {
                    setFieldValue('userName', '');
                    setFieldValue('userEmail', '');
                    setFieldValue('userPhone', '');
                    return null;
                  }
                  firestore
                    .collection('Masjid')
                    .doc(masjidData.id)
                    .update({
                      adminId: firestore.FieldValue.delete(),
                    })
                    .then(
                      (value) => {
                        send('service_6htulue', 'template_nwbvmks', {
                          message: `This ${masjidData.name} has been removed from your list by admin. PLease send a admin request again if you want to be an admin to this masjid`,
                          reply_to: values.userEmail,
                          type: 'Admin Changes',
                        }).then(() => {
                          setLoading1(false);
                          props.preButton?.onClick();
                          props.handleToast();
                        });
                      },
                      (reason) => {
                        console.error(reason, 'formtable when deleting user error');
                      },
                    );
                }}
                type="button"
              >
                {loading1 ? (
                  <Loader type="Puff" color="white" height={12} width={40} />
                ) : (
                  <p style={{ color: 'white' }}>Delete</p>
                )}
              </button>
            </Grid>
            )}
            {props.variant === 'request' && (
            <p style={{ color: 'darkred', margin: '15px' }}>This user will not become admin until he sends a confirmation email or admin request.</p>
            )}
            {_.isUndefined(masjidData?.user?.email) && (
                <p style={{ color: 'darkred', margin: '15px' }}>Please select admin from the list.</p>
            )}
            <Grid item xs={12}>
              <TextField
                label="Google Link"
                name="gLink"
                value={values.gLink}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.gLink && Boolean(errors.gLink)}
                helperText={touched.gLink && errors.gLink}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Masjid Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Latitude"
                name="latitude"
                value={values.latitude}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.latitude && Boolean(errors.latitude)}
                helperText={touched.latitude && errors.latitude}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Longitude"
                name="longitude"
                value={values.longitude}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.longitude && Boolean(errors.longitude)}
                helperText={touched.longitude && errors.longitude}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <div style={{ marginTop: 20 }}>
                  <p>Namaz Timings</p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>Fajar</p>
                    </div>
                    <div>
                      <Field
                        name="timing.fajar"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.fajar',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.fajar, 'hh:mm A').isValid()
                                                      ? moment(values.timing.fajar, 'hh:mm A')
                                                      : values.timing.fajar
                                                }
                      />
                      {errors.timing?.fajar && touched.timing?.fajar && (
                        <p style={ERROR}>{errors.timing?.fajar}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>Zohar</p>
                    </div>
                    <div>
                      <Field
                        name="timing.zohar"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.zohar',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.zohar, 'hh:mm A').isValid()
                                                      ? moment(values.timing.zohar, 'hh:mm A')
                                                      : values.timing.zohar
                                                }
                      />
                      {errors.timing?.zohar && touched.timing?.zohar && (
                        <p style={ERROR}>{errors.timing?.zohar}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>Asar</p>
                    </div>
                    <div>
                      <Field
                        name="timing.asar"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.asar',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.asar, 'hh:mm A').isValid()
                                                      ? moment(values.timing.asar, 'hh:mm A')
                                                      : values.timing.asar
                                                }
                      />
                      {errors.timing?.asar && touched.timing?.asar && (
                        <p style={ERROR}>{errors.timing?.asar}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>Magrib</p>
                    </div>
                    <div>
                      <Field
                        name="timing.magrib"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.magrib',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.magrib, 'hh:mm A').isValid()
                                                      ? moment(values.timing.magrib, 'hh:mm A')
                                                      : values.timing.magrib
                                                }
                      />
                      {errors.timing?.magrib && touched.timing?.magrib && (
                        <p style={ERROR}>{errors.timing?.magrib}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>Isha</p>
                    </div>
                    <div>
                      <Field
                        name="timing.isha"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.isha',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.isha, 'hh:mm A').isValid()
                                                      ? moment(values.timing.isha, 'hh:mm A')
                                                      : values.timing.isha
                                                }
                      />
                      {errors.timing?.isha && touched.timing?.isha && (
                        <p style={ERROR}>{errors.timing?.isha}</p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>
                        Jumma&apos;h Namaz
                      </p>
                    </div>
                    <div>
                      <Field
                        name="timing.jummah"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.jummah',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.jummah, 'hh:mm A').isValid()
                                                      ? moment(values.timing.jummah, 'hh:mm A')
                                                      : null
                                                }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>
                        Eid ul Addah
                      </p>
                    </div>
                    <div>
                      <Field
                        name="timing.eidUlAddah"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.eidUlAddah',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.eidUlAddah, 'hh:mm A').isValid()
                                                      ? moment(values.timing.eidUlAddah, 'hh:mm A')
                                                      : null
                                                }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBlockEnd: 10,
                    }}
                  >
                    <div style={{ alignSelf: 'center' }}>
                      <p style={{ marginLeft: 10, marginTop: 10 }}>
                        Eid ul Fitr
                      </p>
                    </div>
                    <div>
                      <Field
                        name="timing.eidUlFitr"
                        component={MobileTimePicker}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setFieldValue(
                          'timing.eidUlFitr',
                          moment(e).format('hh:mm A'),
                        )}
                        value={
                                                    moment(values.timing.eidUlFitr, 'hh:mm A').isValid()
                                                      ? moment(values.timing.eidUlFitr, 'hh:mm A')
                                                      : null
                                                }
                      />
                    </div>
                  </div>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#eeee',
                      padding: '20px',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderRadius: '10px',
                      width: '100%',
                    }}
                  >
                    {image ? (
                      <>
                        <img
                          alt="masjid"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                          width="150"
                          height="150"
                          src={image}
                        />
                        {/* <button onClick={() => onFileDelete(setFieldValue)}>
                          Delete
                        </button> */}
                      </>
                    ) : (
                      <i
                        className="far fa-folder-open"
                        style={{ fontSize: '100px', color: '#a6a6a6' }}
                      />
                    )}
                    <input
                      type="file"
                      onChange={(e) => onImageChange(e, setFieldValue)}
                      className="filetype"
                      style={{ width: '92px', marginTop: '15px' }}
                    />
                    {errors.pictureURL && (
                    <p style={ERROR}>{errors.pictureURL}</p>
                    )}
                  </Box>
                </div>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              justifyContent: 'flex-end',
            }}
          >
            {props.preButton?.onClick && props.preButton?.text && (
            <button
              style={{
                width: 70,
                color: 'white',
                borderRadius: 7,
                height: 30,
                marginRight: 20,
                backgroundColor: 'darkred',
              }}
              onClick={props.preButton?.onClick}
              type="button"
            >
              {props.preButton?.text}
            </button>
            )}
            <button
              style={{
                color: 'white',
                backgroundColor: 'green',
                borderRadius: 7,
                height: 30,
                paddingRight: 10,
                paddingLeft: 10,
              }}
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <Loader type="Puff" color="white" height={12} width={40} />
              ) : (
                <p>{props.Label ? props.Label : 'Accept Request'}</p>
              )}
            </button>
          </div>
        </>
      )}
    </Formik>
  );
}

FormsTable.propTypes = {
  masjidData: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
      phone: PropTypes.string,
      name: PropTypes.string,
      isAdmin: PropTypes.bool,
      email: PropTypes.string,
    }),
    adminId: PropTypes.string,
    name: PropTypes.string,
    g: PropTypes.shape({
      geohash: PropTypes.string,
      geopoint: PropTypes.shape({
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      }),
    }),
    pictureURL: PropTypes.string,
    address: PropTypes.string,
    id: PropTypes.string,
    timing: PropTypes.shape({
      isha: PropTypes.string,
      fajar: PropTypes.string,
      zohar: PropTypes.string,
      asar: PropTypes.string,
      magrib: PropTypes.string,
    }),
  }),
  preButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  }),
  variant: PropTypes.oneOf(['new', 'request', 'edit']).isRequired,
};

export default FormsTable;
