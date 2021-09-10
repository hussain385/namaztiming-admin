import React from "react";
// import { Modal, ModalTransition, useModal } from "react-simple-hook-modal";
// import "./requestTable.css";
import { Formik } from "formik";
// import "react-simple-hook-modal/dist/styles.css";
import {useFirebase, useFirestore} from "react-redux-firebase";
import _ from "lodash";
import geohash from "ngeohash";
import {useState} from "react";
import {MasjidSchema} from "../../services/validation";


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

const AddMasjidForm = () => {
    const firestore = useFirestore();
    const firebase = useFirebase();
    const [image, setImage] = useState(null);
    const [path, setPath] = useState('')
    const filePath = 'MasjidUploads'
    // const uploadedFile = useSelector(({ firebase: { data } }) => data[filePath])

    const onImageChange = async (event, handleChange, value) => {
        if (event.target.files && event.target.files[0]) {
            firebase.uploadFile(filePath, event.target.files[0]).then(snapshot => {
                setPath(snapshot.uploadTaskSnaphot._delegate.metadata.fullPath);
                snapshot.uploadTaskSnaphot.ref.getDownloadURL().then(url => {
                    value = url
                    handleChange(url);
                    console.log(' * new url', url)
                    setImage(url);
                })
            })
            // console.log(URL.createObjectURL(event.target.files[0]),event.target.files[0])
        }
    };

    function onFileDelete() {
        console.log(path)
        setImage('')
        if (path) {
            return firebase.deleteFile(path)
        }
    }

    return (
        <Formik
            initialValues={{
                name: "",
                address: "",
                gLink: "",
                pictureURL: "",
                userEmail: "",
                userName: "",
        userPhone: "",
                latitude: "",
                longitude: "",
                timing: {
                    isha: "",
                    fajar: "",
                    zohar: "",
                    asar: "",
                    magrib: "",
                },
            }}
            validationSchema={MasjidSchema}
            onSubmit={async (values) => {
                const data = _.omit(values, ["latitude", "longitude"]);
                await firestore.add("Masjid", {
                    ...data,
                    g: {
                        geopoint: new firestore.GeoPoint(values.latitude, values.longitude),
                        geohash: geohash.encode(values.latitude, values.longitude, 9),
                    },
                });
                alert('Sent')
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
              height: "60vh",
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
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#eeee",
                padding: "20px",
                alignItems: "center",
                alignSelf: "center",
                marginInline: "30%",
                borderRadius: "10px",
              }}
            >
              {image ? (
                  <>
                      <img
                          alt="masjid"
                          // style={{ alignSelf: "center" }}
                          width={250}
                          height={200}
                          src={image}
                      />
                      <button onClick={onFileDelete}>
                          Delete
                      </button>
                  </>
              ) : (
                <i
                  className="far fa-folder-open"
                  style={{ fontSize: "100px", color: "#a6a6a6" }}
                />
              )}
              <input
                  type="file"
                  onChange={(e) => onImageChange(e, handleChange('pictureURL'), values.pictureURL)}
                  className="filetype"
                  style={{ width: "92px", marginTop: "15px" }}
              />
                {errors.pictureURL && <p>{errors.pictureURL}</p>}
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

export default AddMasjidForm;
