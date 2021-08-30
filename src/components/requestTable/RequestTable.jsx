import React, { useEffect, useState } from "react";
import { Modal, useModal, ModalTransition } from "react-simple-hook-modal";
import "./requestTable.css";
import { Formik } from "formik";
import "react-simple-hook-modal/dist/styles.css";
import * as Yup from "yup";

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

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

const AddMasjidSchema = Yup.object().shape({
  name: Yup.string().required("Masjid name is required"),
  address: Yup.string().url().required("Masjid address is required"),
  pictureURL: Yup.string()
    .url("Not a valid url")
    .required("Masjid's pictureURL is required"),
  userEmail: Yup.string().email().required("Email is required"),
  userName: Yup.string().required("Your name is required"),
  userPhone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(11, "phone no. is short, please check again")
    .max(16, "phone no. is long, please check again")
    .required("Your Phone no. is required"),
  timing: Yup.string().required("Timings are required "),
  // timing: Yup.object().shape({
  //   isha: Yup.string(),
  //   fajar: Yup.string(),
  //   zohar: Yup.string(),
  //   asar: Yup.string(),
  //   magrib: Yup.string(),
  //   jummuah: Yup.string(),
  // }),
});

const MyComponent = (props) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  console.log(props.item.pictureURL);
  return (
    <>
      <tr key={props.index}>
        <td>{props.index + 1}</td>
        <td>{props.item.name}</td>
        <td>{props.item.userName}</td>
        <td>{props.item.userPhone}</td>
        <td>
          <button onClick={openModal} className="buttonStyle">
            View
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
            name: `${props.item.name}`,
            address: `${props.item.address}`,
            pictureURL: `${props.item.pictureURL}`,
            userEmail: `${props.item.userEmail}`,
            userName: `${props.item.userName}`,
            userPhone: `${props.item.userPhone}`,
            timing: {
              isha: `${props.item.timing.isha}`,
              fajar: `${props.item.timing.fajar}`,
              zohar: `${props.item.timing.zohar}`,
              asar: `${props.item.timing.asar}`,
              magrib: `${props.item.timing.magrib}`,
            },
          }}
          validationSchema={AddMasjidSchema}
          onSubmit={(values) => {
            console.log(values);
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
            <form className="flex flex-col-reverse" onSubmit={handleSubmit}>
              <div style={{ height: "70vh", overflowY: "scroll" }}>
                <p>Masjid Name</p>
                <input
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  style={INPUT}
                  placeholder="Enter Masjid Name..."
                  placeholderTextColor="grey"
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
                  placeholderTextColor="grey"
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
                  placeholderTextColor="grey"
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
                  placeholderTextColor="grey"
                />
                {errors.userPhone && touched.userPhone && (
                  <p style={ERROR}>{errors.userPhone}</p>
                )}
                <p style={{ marginLeft: 10, marginTop: 10 }}>Masjid Address</p>

                <input
                  onChange={handleChange("address")}
                  value={values.address}
                  onBlur={handleBlur("address")}
                  style={INPUT}
                  placeholder="Enter Masjid Address Google Link..."
                  placeholderTextColor="grey"
                />
                {errors.address && touched.address && (
                  <p style={ERROR}>{errors.address}</p>
                )}

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
                        placeholderTextColor="grey"
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
                        placeholderTextColor="grey"
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
                        placeholderTextColor="grey"
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
                        placeholderTextColor="grey"
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
                        placeholderTextColor="grey"
                      />
                    </div>
                  </div>
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
                  disabled={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

const RequestTable = (props) => {
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
  }, [props.bodyData]);

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
          {props.bodyData && props.renderBody ? (
            <tbody>
              {dataShow.map((item, index) => (
                <MyComponent index={index} item={item} />
              ))}
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

export default RequestTable;
