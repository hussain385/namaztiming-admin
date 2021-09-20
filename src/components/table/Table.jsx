import React, { useEffect, useState } from "react";
import _ from "lodash";
import { ModalTransition, useModal, Modal } from "react-simple-hook-modal";
import { Formik } from "formik";
import "react-simple-hook-modal/dist/styles.css";
import { useFirestore } from "react-redux-firebase";
import geohash from "ngeohash";
import { MasjidSchema } from "../../services/validation";
import "./table.css";

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

const RenderBody = ({ item, index }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const firestore = useFirestore();
  const [timing, setTiming] = useState({
    isha: item.timing ? item.timing.isha : "08:30 PM",
    magrib: item.timing ? item.timing.magrib : "07:00 PM",
    fajar: item.timing ? item.timing.fajar : "05:30 AM",
    asar: item.timing ? item.timing.asar : "05:30 PM",
    zohar: item.timing ? item.timing.zohar : "01:30 PM",
  });
  const [user, setUser] = useState({
    gLink: item.gLink ? item.gLink : "",
    userEmail: item.userEmail ? item.userEmail : "",
    userName: item.userName ? item.userName : "",
    userPhone: item.userPhone ? item.userPhone : "",
  });
  console.log(timing);
  return (
    <>
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td style={{ width: "30vw" }}>{item.address}</td>
        <td
          style={{
            flexDirection: "row",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <button onClick={openModal} className="buttonStyle">
            View
          </button>
          <button
            // onClick={openModal}
            className="buttonStyle"
            style={{ backgroundColor: "darkred", marginLeft: 15 }}
          >
            delete
          </button>
        </td>
      </tr>
      <Modal
        id="any-unique-identifier"
        isOpen={isModalOpen}
        transition={ModalTransition.BOTTOM_UP}
      >
        <Formik
          initialValues={{
            name: `${item.name}`,
            address: `${item.address}`,
            gLink: `${user.gLink}`,
            pictureURL: `${item.pictureURL}`,
            userEmail: `${user.userEmail}`,
            userName: `${user.userName}`,
            userPhone: `${user.userPhone}`,
            latitude: `${item.g.geopoint._lat}`,
            longitude: `${item.g.geopoint._long}`,
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
              .update("Masjid/"+ item.id, {
                ...data,
                g: {
                  geopoint: new firestore.GeoPoint(
                    values.latitude,
                    values.longitude
                  ),
                  geohash: geohash.encode(values.latitude, values.longitude, 9),
                },
              })
              .then((snapshot) => {
                console.log(snapshot);
                firestore
                  .delete({ collection: "newMasjid", doc: item.id })
                  .then((value) => {
                    console.log(value, "deleted");
                  });
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
                {errors.name && touched.name && (
                  <p style={ERROR}>{errors.name}</p>
                )}
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
                <p style={{ marginLeft: 10, marginTop: 10 }}>
                  Admin Phone Number
                </p>
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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                  onClick={closeModal}
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
      </Modal>
    </>
  );
};

const Table = (props) => {
  const initDataShow =
    props.limit && props.bodyData
      ? props.bodyData.slice(0, Number(props.limit))
      : props.bodyData;

  const [dataShow, setDataShow] = useState(initDataShow);

  let pages = 1;

  let range = [];

  if (props.limit !== undefined) {
    let page = Math.floor(props.bodyData.length / Number(props.limit));
    pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
    range = [...Array(pages).keys()];
  }

  const [currPage, setCurrPage] = useState(0);

  const selectPage = (page) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);

    setDataShow(props.bodyData.slice(start, end));

    setCurrPage(page);
  };

  useEffect(() => {
    setDataShow(
      props.limit && props.bodyData
        ? props.bodyData.slice(0, Number(props.limit))
        : props.bodyData
    );
  }, [props.bodyData, props.limit]);

  return (
    <div>
      <div className="table-wrapper">
        <table>
          {props.headData && props.renderHead ? (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          ) : null}
          {props.bodyData ? (
            <tbody>
              {props.edit ? (
                <>
                  {dataShow.map((item, index) => (
                    <RenderBody index={index} item={item} />
                  ))}
                </>
              ) : (
                <>
                  {dataShow.map((item, index) => props.renderBody(item, index))}
                </>
              )}
            </tbody>
          ) : null}
        </table>
      </div>
      {pages > 1 ? (
        <div className="table__pagination">
          {range.map((item, index) => (
            <div
              key={index}
              className={`table__pagination-item ${
                currPage === index ? "active" : ""
              }`}
              onClick={() => selectPage(index)}
            >
              {item + 1}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Table;
