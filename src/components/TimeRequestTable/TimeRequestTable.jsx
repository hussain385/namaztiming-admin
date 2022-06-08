import React from 'react';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import { useFirestore } from 'react-redux-firebase';
import { sendNotification } from '../../services/pushNotification';

const ERROR = {
  color: 'darkred',
  fontSize: 12,
  marginTop: 5,
};

// const INPUT = {
//   borderRadius: 5,
//   padding: 10,
//   backgroundColor: '#eeee',
//   width: '100%',
// };
function TimeRequestTable(props) {
  const firestore = useFirestore();

  return (
    <div>
      <Formik
        initialValues={{
          userName: `${props.data.userName}`,
          userPhone: `${props.data.userPhone}`,
          timing: {
            isha: props.data?.timing?.isha || null,
            fajar: props.data?.timing?.fajar || null,
            zohar: props.data?.timing?.zohar || null,
            asar: props.data?.timing?.asar || null,
            magrib: props.data?.timing?.magrib || null,
            jummah: props.data?.timing?.jummah || null,
            eidUlAddah: props.data?.timing?.eidUlAddah || null,
            eidUlFitr: props.data?.timing?.eidUlFitr || null,
          },
        }}
        validationSchema={Yup.object().shape({
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
        onSubmit={(values) => {
          firestore
            .update(`Masjid/${props.masjidId}`, {
              timeStamp: firestore.Timestamp.now(),
              requestList: firestore.FieldValue.arrayRemove(props.data.id),
              timing: {
                ...values.timing,
              },
            })
            .then(async () => {
              const masjid = await firestore
                .collection('Masjid')
                .doc(props.masjidId)
                .get();
              if (masjid.data().tokens) {
                for (const token of masjid.data().tokens) {
                  sendNotification(
                    token,
                    masjid.data().name,
                    'Timings has been updated',
                  ).then(
                    (value) => {
                      console.log(value);
                    },
                    (reason) => {
                      console.error(reason);
                    },
                  );
                }
              }
              if (props.data.token) {
                sendNotification(
                  props.data.token,
                  'Requested Time Has Been Updated',
                  `Your request from ${props.masjidName} has been approved and updated`,
                ).then(
                  (value) => {
                    console.log(value);
                  },
                  (reason) => {
                    console.error(reason);
                  },
                );
              }
              firestore
                .delete(`requests/${props.data.id}`)
                .then(() => props.preButton.onClick());
            });
        }}
      >
        {({
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
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
              Time Edit Request
            </h1>
            <Grid
              style={{
                height: '63vh',
                overflowY: 'scroll',
                paddingRight: 10,
              }}
              spacing={2}
              container
            >
              <Grid item xs={12} md={6}>
                <TextField
                  label="User Name"
                  name="userName"
                  value={values.userName}
                  onChange={(event) => {
                    setFieldValue('userName', event.target.value);
                  }}
                  onBlur={handleBlur}
                  error={touched.userName && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="User Phone"
                  name="userPhone"
                  value={values.userPhone}
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue('userPhone', event.target.value);
                  }}
                  error={touched.userPhone && Boolean(errors.userPhone)}
                  helperText={touched.userPhone && errors.userPhone}
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
                                                        moment(
                                                          values.timing.eidUlAddah,
                                                          'hh:mm A',
                                                        ).isValid()
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
                    {errors.timing && <p>{JSON.stringify(errors.timing)}</p>}
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
              <button
                style={{
                  width: 70,
                  color: 'white',
                  borderRadius: 7,
                  height: 30,
                  marginRight: 20,
                  backgroundColor: 'darkred',
                }}
                onClick={props.preButton.onClick}
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
    </div>
  );
}

export default TimeRequestTable;
