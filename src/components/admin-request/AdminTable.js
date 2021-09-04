import React, { useEffect, useState } from "react";
import { Modal, ModalTransition, useModal } from "react-simple-hook-modal";
import "./adminTable.css";
import { Formik } from "formik";
import "react-simple-hook-modal/dist/styles.css";
import * as Yup from "yup";
import {useFirebase, useFirestore} from "react-redux-firebase";

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

const AddMasjidSchema = Yup.object().shape({
  name: Yup.string().required("Masjid name is required"),
  address: Yup.string().required("Masjid address is required"),
  latitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
    (value + "").match(/^\d*\.{1}\d*$/)
  ),
  longitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
    (value + "").match(/^\d*\.{1}\d*$/)
  ),
  gLink: Yup.string().url().required("Masjid address is required"),
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
  // timing: Yup.string().required("Timings are required "),
  timing: Yup.object().shape({
    isha: Yup.string(),
    fajar: Yup.string(),
    zohar: Yup.string(),
    asar: Yup.string(),
    magrib: Yup.string(),
    jummuah: Yup.string(),
  }),
});

const MyComponent = (props) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const firebase = useFirebase();
  return (
    <>
      <tr key={props.index}>
        <td>{props.index + 1}</td>
        <td>{props.item.masjid.id}</td>
        <td>{props.item.userName}</td>
        <td>{props.item.userPhone}</td>
        <td style={{ justifyContent: "center", textAlign: "center" }}>
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
            userEmail: `${props.item.userEmail}`,
            userName: `${props.item.userName}`,
            userPhone: `${props.item.userPhone}`,
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
            <>
              <div
                style={{
                  height: "50vh",
                  overflowY: "auto",
                  paddingRight: 10,
                }}
              >
                <h1 style={{ textAlign: "center" }}>Admin Request</h1>
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
              </div>
              <p>{props.item.masjid.name}</p>
              <p>{props.item.masjid.address}</p>
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

const AdminTable = (props) => {
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
          {props.bodyData && props.renderBody ? (
            <tbody>
              {dataShow.map((item, index) => (
                <MyComponent key={index} index={index} item={item} />
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

export default AdminTable;