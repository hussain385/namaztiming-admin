import React, { useEffect, useState } from "react";
import { useFirestore } from "react-redux-firebase";
import { Formik } from "formik";
import geohash from "ngeohash";
import _ from "lodash";
import { MasjidSchema } from "../../services/validation";

const ERROR = {
  color: "darkred",
  fontSize: 12,
  marginTop: 5,
};

const INPUT = {
  borderRadius: 5,
  padding: 10,
  backgroundColor: "#eeee",
  width: "100%",
};

const TIMEINPUT = {
  borderRadius: 5,
  padding: 10,
  backgroundColor: "#eeee",
  width: "100%",
  textAlign: "center",
};

const FormsTable = (props) => {
  const firestore = useFirestore();
  const [timing, setTiming] = useState({
    isha: props.item.timing ? props.item.timing.isha : "08:30 PM",
    magrib: props.item.timing ? props.item.timing.magrib : "07:00 PM",
    fajar: props.item.timing ? props.item.timing.fajar : "05:30 AM",
    asar: props.item.timing ? props.item.timing.asar : "05:30 PM",
    zohar: props.item.timing ? props.item.timing.zohar : "01:30 PM",
  });
  const [user, setUser] = useState({
    gLink: props.item.gLink ? props.item.gLink : "",
    userEmail: props.item.user?.email ? props.item.user.email : "",
    userName: props.item.user?.name ? props.item.user.name : "",
    userPhone: props.item.user?.phone ? props.item.user.phone : "",
  });
  useEffect(() => {
    async function values() {
      await setUser({
        gLink: props.item.gLink ? props.item.gLink : "",
        userEmail: props.item.user?.email ? props.item.user.email : "",
        userName: props.item.user?.name ? props.item.user.name : "",
        userPhone: props.item.user?.phone ? props.item.user.phone : "",
      });
    }
    values();
  }, []);
  return (
    <Formik
      initialValues={{
        name: `${props.item.name}`,
        address: `${props.item.address}`,
        gLink: `${user.gLink}`,
        pictureURL: `${props.item.pictureURL}`,
        userEmail: `${user.userEmail}`,
        userName: `${user.userName}`,
        userPhone: `${user.userPhone}`,
        latitude: `${props.item.g?.geopoint._lat}`,
        longitude: `${props.item.g?.geopoint._long}`,
        timing: {
          isha: `${timing.isha}`,
          fajar: `${timing.fajar}`,
          zohar: `${timing.zohar}`,
          asar: `${timing.asar}`,
          magrib: `${timing.magrib}`,
        },
      }}
      validationSchema={MasjidSchema}
      onSubmit={(values) => {
        const data = _.omit(values, ["latitude", "longitude"]);
        firestore
          .update("Masjid/" + props.item.id, {
            ...data,
            g: {
              geopoint: new firestore.GeoPoint(
                values.latitude,
                values.longitude
              ),
              geohash: geohash.encode(values.latitude, values.longitude, 9),
            },
          })
          .then(props.closeModal);
      }}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
        /* and other goodies */
      }) => (
        <>
          <div
            style={{
              height: "70vh",
              overflowY: "scroll",
              paddingRight: 10,
            }}
          >
            <p>Masjid Name</p>
            <input
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              style={INPUT}
              placeholder="Enter Masjid Name..."
            />
            {errors.name && touched.name && <p style={ERROR}>{errors.name}</p>}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Name</p>
            <input
              onChange={handleChange("userName")}
              value={values.userName}
              onBlur={handleBlur("userName")}
              style={INPUT}
              placeholder="Enter Your Name..."
            />
            {errors.userName && touched.userName && (
              <p style={ERROR}>{errors.userName}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Email</p>
            <input
              onChange={handleChange("userEmail")}
              value={values.userEmail}
              onBlur={handleBlur("userEmail")}
              style={INPUT}
              placeholder="Enter Your Email..."
            />
            {errors.userEmail && touched.userEmail && (
              <p style={ERROR}>{errors.userEmail}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Admin Phone Number</p>
            <input
              onChange={handleChange("userPhone")}
              value={values.userPhone}
              onBlur={handleBlur("userPhone")}
              style={INPUT}
              placeholder="Enter Your Phone Number..."
            />
            {errors.userPhone && touched.userPhone && (
              <p style={ERROR}>{errors.userPhone}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Google Link</p>

            <input
              onChange={handleChange("gLink")}
              value={values.gLink}
              onBlur={handleBlur("gLink")}
              style={INPUT}
              placeholder="Enter Masjid Address Google Link..."
            />
            {errors.gLink && touched.gLink && (
              <p style={ERROR}>{errors.gLink}</p>
            )}
            <p style={{ marginLeft: 10, marginTop: 10 }}>Masjid Address</p>

            <input
              onChange={handleChange("address")}
              value={values.address}
              onBlur={handleBlur("address")}
              style={INPUT}
              placeholder="Enter Masjid Address..."
            />
            {errors.address && touched.address && (
              <p style={ERROR}>{errors.address}</p>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ marginRight: 10, width: "30vw" }}>
                <p style={{ marginLeft: 10, marginTop: 10 }}>Latitude</p>

                <input
                  onChange={handleChange("latitude")}
                  value={values.latitude}
                  onBlur={handleBlur("latitude")}
                  style={INPUT}
                  placeholder="Enter Latitude..."
                />
                {errors.latitude && touched.latitude && (
                  <p style={ERROR}>{errors.latitude}</p>
                )}
              </div>
              <div style={{ marginLeft: 10, width: "30vw" }}>
                <p style={{ marginLeft: 10, marginTop: 10 }}>Longitude</p>

                <input
                  onChange={handleChange("longitude")}
                  value={values.longitude}
                  onBlur={handleBlur("longitude")}
                  style={INPUT}
                  placeholder="Enter Longitude..."
                />
                {errors.longitude && touched.longitude && (
                  <p style={ERROR}>{errors.longitude}</p>
                )}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <p>Namaz Timings</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlockEnd: 10,
                }}
              >
                <div>
                  <p style={{ marginLeft: 10, marginTop: 10 }}>Fajar</p>
                </div>
                <div>
                  <input
                    onChange={handleChange("timing")}
                    value={values.timing.fajar}
                    onBlur={handleBlur("timing")}
                    style={TIMEINPUT}
                    placeholder="00:00 AM"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlockEnd: 10,
                }}
              >
                <div>
                  <p style={{ marginLeft: 10, marginTop: 10 }}>Zohar</p>
                </div>
                <div>
                  <input
                    onChange={handleChange("timing")}
                    value={values.timing.zohar}
                    onBlur={handleBlur("timing")}
                    style={TIMEINPUT}
                    placeholder="00:00 AM"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlockEnd: 10,
                }}
              >
                <div>
                  <p style={{ marginLeft: 10, marginTop: 10 }}>Asar</p>
                </div>
                <div>
                  <input
                    onChange={handleChange("timing")}
                    value={values.timing.asar}
                    onBlur={handleBlur("timing")}
                    style={TIMEINPUT}
                    placeholder="00:00 AM"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlockEnd: 10,
                }}
              >
                <div>
                  <p style={{ marginLeft: 10, marginTop: 10 }}>Magrib</p>
                </div>
                <div>
                  <input
                    onChange={handleChange("timing")}
                    value={values.timing.magrib}
                    onBlur={handleBlur("timing")}
                    style={TIMEINPUT}
                    placeholder="00:00 AM"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBlockEnd: 10,
                }}
              >
                <div>
                  <p style={{ marginLeft: 10, marginTop: 10 }}>Isha</p>
                </div>
                <div>
                  <input
                    onChange={handleChange("timing")}
                    value={values.timing.isha}
                    onBlur={handleBlur("timing")}
                    style={TIMEINPUT}
                    placeholder="00:00 AM"
                  />
                </div>
              </div>
              {errors.timing && <p>{errors.timing}</p>}
              <div>
                <img
                  alt="masjid"
                  style={{ alignSelf: "center" }}
                  width={250}
                  height={200}
                  src={values.pictureURL}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{
                width: 70,
                color: "white",
                borderRadius: 7,
                height: 30,
                marginRight: 20,
                backgroundColor: "darkred",
              }}
              onClick={props.closeModal}
            >
              Close
            </button>
            <button
              style={{
                width: 70,
                color: "white",
                backgroundColor: "green",
                borderRadius: 7,
                height: 30,
              }}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </>
      )}
    </Formik>
  );
};

export default FormsTable;
