import React, { useState } from 'react';
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import { Field, Formik } from 'formik';
import { LocalizationProvider, MobileTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import { Autocomplete, Box, Grid, TextField } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';
import geohash from 'ngeohash';
import { useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { MasjidSchema } from '../../services/validation';
import { MasjidDataModel, MasjidFormModel } from '../../services/models';

const ERROR = {
  color: 'darkred',
  fontSize: 12,
  marginTop: 5,
};

Formik.propTypes = {
  initialValues: MasjidFormModel,
};

function FormsTable({ masjidData, variant, preButton, handleToast, Label }) {
  useFirestoreConnect([
    {
      collection: 'users',
    },
  ]);

  // const {masjidData, preButton: {onClick: preButtonClick, text: preButtonText}, onSubmit} = props
  const firebase = useFirebase();
  const filePath = 'MasjidUploads';
  const [image, setImage] = useState(masjidData?.pictureURL);
  const firestore = useFirestore();
  const users = useSelector(state => state.firestore.ordered.users);
  const loading = users ? users.length === 0 : true;
  const [edit, setEdit] = useState(false);

  const onImageChange = async (event, setFieldValue) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
      setFieldVa"pictureURL"URL', event.target.files[0]);
    }
  };

  // function onFileDelete(setFieldValue) {
  //   if (!(masjidData.pictureURL instanceof File)) {
  //     // firebase.storage()
  //     return firebase.deleteFile(masjidData.pictureURL).then(() => {
  //       setFieldValue('pictureURL', '');
  //       setImage('');
  //     });
  //   }
  //   setImage('');
  // }

  return (
    <Formik
      initialValues={{
        name: masjidData?.name""| '',
        address: masjidData?.address""| '',
        gLink: masjidData?.gLink""| '',
        pictureURL: masjidData?.pictureURL,
        userEmail: masjidData?.user?.email || masjidData?.userEmail""| '',
        userName: masjidData?.user?.name || masjidData?.userName""| '',
        userPhone: masjidData?.user?.phone || masjidData?.userPhone""| '',
        latitude: masjidData?.g?.geopoint.latitude""| '',
        longitude: masjidData?.g?.geopoint.longitude""| '',
        timing: {
          isha: masjidData?.timing?.isha || null,
          fajar: masjidData?.timing?.fajar || null,
          zohar: masjidData?.timing?.zohar || null,
          asar: masjidData?.timing?.asar || null,
          magrib: masjidData?.timing?.magrib || null,
          jummah: masjidData?.timing?.jummah || null,
          eidUlAddah: masjidData?.timing?.eidUlAddah || null,
          eidUlFitr: masjidData?.timing?.eidUlFitr || ull,
       },
      }}
      validationSchema={MasjidSchema}
      validateOnChange={false}
      validateOnBlur
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        const filter = [
          "latitude",
          "longitude",
          "pictureURL",
          "userName",
          "userEmail",
          "userPhone"
        ];
        const data = _.omit(values, filter);
        let pictureURL;
        if (values.pictureURL instanceof File) {
          try {
            const uploadedRef = await firebase.uploadFile(
              filePath,
              values.pictureURL
            );
            pictureURL =
              await uploadedRef.uploadTaskSnaphot.ref.getDownloadURL();
          } catch (e) {
            console.error(e);
          }
        } else {
          pictureURL = values.pictureURL;
        }
        if (variant === "new" || variant === "request") {
          firestore
            .add("Masjid", {
              ...data,
              pictureURL,
              g: {
                geopoint: new firestore.GeoPoint(
                  values.latitude,
                  values.longitude
                ),
                geohash: geohash.encode(values.latitude, values.longitude, 9)
              },
              timeStamp: firestore.Timestamp.now(),
            })
            .then(async () => {
              if (variant === "request") {
                await firestore
                  .delete({ collection: "newMasjid", doc: masjidData.id })
                  .then(() => {
                    setSubmitting(false);
                    preButton?.onClick();
                  });
              }
              resetForm({ values: "" });
              setImage("");
              setSubmitting(false);
              handleToast();
            });
        } else if (variant === "edit") {
          firestore
            .update(`Masjid/${masjidData.id}`, {
              ...data,
              pictureURL,
              g: {
                geopoint: new firestore.GeoPoint(
                  values.latitude,
                  values.longitude
                ),
                geohash: geohash.encode(values.latitude, values.longitude, 9)
              },
              timeStamp: firestore.Timestamp.now()
            })
            .then(() => {
              preButton?.onClick();
              setSubmitting(false);
              handleToast();
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
        isSubmitting,
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
                onChange={event => {
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
                options={users && users}
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
                  return null;
                }}
                onInputChange={(event, value) => {
                  setFieldValue('userName', value);
                }}
                getOptionLabel={option => {
                  if (option.name) {
                    return option.name;
                  }
                  return option;
                }}
                value={values.userName}
                disabled={
                  (masjidData?.user?.name || masjidData?.userName) && !edit
                }
                renderInput={params => (
                  <TextField
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
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
                options={users && users}
                loading={loading}
                disabled={
                  (masjidData?.user?.email || masjidData?.userEmail) && !edit
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
                  return null;
                }}
                onInputChange={(event, value) => {
                  setFieldValue('userEmail', value);
                }}
                getOptionLabel={option => {
                  if (option.email) {
                    return option.email;
                  }
                  return option;
                }}
                value={values.userEmail}
                renderInput={params => (
                  <TextField
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
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
                  (masjidData?.user?.phone || masjidData?.userPhone) && !edit
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
              _.isUndefined(masjidData?.user?.email) &&
              _.isUndefined(masjidData?.userEmail)
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
                  onClick={() => setEdit(prevState => !prevState)}
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
                    if (variant === "request") {
                      setFieldValue("userName", "");
                      setFieldValue("userEmail", "");
                      setFieldValue("userPhone", "");
                      return null;
                    }
                    firestore
                      .collection('Masjid')
                      .doc(masjidData.id)
                      .update({
                        adminId: firestore.FieldValue.delete(),
                      })
                      .then(
                        value => {
                          console.log(value);
                        },
                        reason => {
                          console.error(reason);
                        }
                      );
                    return null;
                  }}
                  type="button"
                >
                  Delete
                </button>
              </Grid>
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.fajar',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.zohar',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.asar',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.magrib',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.isha',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        Jumma&aposh Namaz
                      </p>
                    </div>
                    <div>
                      <Field
                        name="timing.jummah"
                        component={MobileTimePicker}
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.jummah',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.eidUlAddah',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        renderInput={params => <TextField {...params} />}
                        onChange={e =>
                          setFieldValue(
                            'timing.eidUlFitr',
                            moment(e).format('hh:mm A'),
                          )
                        }
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
                          // style={{ alignSelf: "center" }}
                          width="auto"
                          height="auto"
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
                      onChange={e => onImageChange(e, setFieldValue)}
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
            {preButton?.onClick && preButton?.text && (
              <button
                style={{
                  width: 70,
                  color: "white",
                  borderRadius: 7,
                  height: 30,
                  marginRight: 20,
                  backgroundColor: "darkred"
                }}
                onClick={preButton?.onClick}
                type="button"
              >
                {preButton?.text}
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
                <p>{Label || "Accept Request"}</p>
              )}
            </button>
          </div>
        </>
      )}
    </Formik>
  );
}

FormsTable.propTypes = {
  masjidData: MasjidDataModel,
  preButton: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
  }),
  variant: PropTypes.oneOf(["new", "request", "edit"]).isRequired,
  handleToast: PropTypes.func.isRequired,
  Label: PropTypes.string
};

FormsTable.defaultProps = {
  masjidData: null,
  preButton: null,
  Label: null
};

export default FormsTable;
