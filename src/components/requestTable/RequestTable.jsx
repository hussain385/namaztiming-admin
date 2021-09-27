import React, {useEffect, useState} from "react";
import {Modal, ModalTransition, useModal} from "react-simple-hook-modal";
import "./requestTable.css";
import {Formik,Field} from "formik";
import "react-simple-hook-modal/dist/styles.css";
import {useFirestore} from "react-redux-firebase";
import _ from 'lodash'
import geohash from "ngeohash";
import {MasjidSchema} from "../../services/validation";
import TimePicker from '@mui/lab/TimePicker';
import {TextField} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterMoment";
import {LocalizationProvider, MobileTimePicker} from "@mui/lab";
import moment from "moment";


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

const MyComponent = (props) => {
    const {isModalOpen, openModal, closeModal} = useModal();
    const firestore = useFirestore();
    return (
        <>
            <tr key={props.index}>
                <td>{props.index + 1}</td>
                <td>{props.item.name}</td>
                <td>{props.item.userName}</td>
                <td>{props.item.userPhone}</td>
                <td style={{justifyContent: "center", textAlign: "center"}}>
                    <button onClick={openModal} className="buttonStyle">
                        View
                    </button>
                    <button
                        // onClick={openModal}
                        className="buttonStyle"
                        style={{backgroundColor: "darkred", marginLeft: 15}}
                    >
                        Delete
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
                        address: "",
                        gLink: `${props.item.gLink}`,
                        pictureURL: `${props.item.pictureURL}`,
                        userEmail: `${props.item.userEmail}`,
                        userName: `${props.item.userName}`,
                        userPhone: `${props.item.userPhone}`,
                        latitude: "",
                        longitude: "",
                        timing: {
                            isha: `${props.item.timing.isha}`,
                            fajar: `${props.item.timing.fajar}`,
                            zohar: `${props.item.timing.zohar}`,
                            asar: `${props.item.timing.asar}`,
                            magrib: `${props.item.timing.magrib}`,
                        },
                    }}
                    validationSchema={MasjidSchema}
                    onSubmit={(values) => {
                        const data = _.omit(values, ['latitude', 'longitude'])
                        console.log(values)
                        // firestore
                        //     .add("Masjid", {
                        //         ...data,
                        //         g: {
                        //             geopoint: new firestore.GeoPoint(values.latitude, values.longitude),
                        //             geohash: geohash.encode(values.latitude, values.longitude, 9)
                        //         }
                        //     })
                        //     .then((snapshot) => {
                        //         console.log(snapshot);
                        //         firestore.delete({collection: 'newMasjid', doc: props.item.id}).then(value => {
                        //             console.log(value, 'deleted')
                        //         })
                        //     });
                    }}
                >
                    {({
                          handleChange,
                          handleSubmit,
                          handleBlur,
                          values,
                          errors,
                          touched,
                          setFieldValue
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
                                <p style={{marginLeft: 10, marginTop: 10}}>Admin Name</p>
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
                                <p style={{marginLeft: 10, marginTop: 10}}>Admin Email</p>
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
                                <p style={{marginLeft: 10, marginTop: 10}}>
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
                                <p style={{marginLeft: 10, marginTop: 10}}>Google Link</p>

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
                                <p style={{marginLeft: 10, marginTop: 10}}>Masjid Address</p>

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
                                    style={{display: "flex", justifyContent: "space-between"}}
                                >
                                    <div style={{marginRight: 10, width: "30vw"}}>
                                        <p style={{marginLeft: 10, marginTop: 10}}>Latitude</p>

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
                                    <div style={{marginLeft: 10, width: "30vw"}}>
                                        <p style={{marginLeft: 10, marginTop: 10}}>Longitude</p>

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
                                <LocalizationProvider dateAdapter={DateAdapter}>
                                    <div style={{marginTop: 20}}>
                                        <p>Namaz Timings</p>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingBlockEnd: 10,
                                            }}
                                        >
                                            <div style={{'align-self': 'center'}}>
                                                <p style={{marginLeft: 10, marginTop: 10, }}>Fajar</p>
                                            </div>
                                            <div>
                                                <Field
                                                    name={'timing.fajar'}
                                                    component={MobileTimePicker}
                                                    renderInput={(params) => <TextField style={TIMEINPUT} {...params} />}
                                                    onChange={(e) => setFieldValue("timing.fajar", moment(e).format('hh:mm A'))}
                                                    value={(moment(values.timing.fajar, 'hh:mm A').isValid() ? moment(values.timing.fajar, 'hh:mm A') : values.timing.fajar)}
                                                />
                                                {/*<TimePicker*/}
                                                {/*    onChange={(e) => setFieldValue("fajar", e)*/}
                                                {/*    }*/}
                                                {/*    value={moment(values.fajar, 'hh:mm A').isValid() ? moment(values.fajar, 'hh:mm A') : values.fajar}*/}
                                                {/*    renderInput={(params) => <TextField {...params} />}*/}
                                                {/*    onError={reason => {*/}
                                                {/*        console.log(reason)}}*/}
                                                {/*/>*/}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingBlockEnd: 10,
                                            }}
                                        >
                                            <div style={{'align-self': 'center'}}>
                                                <p style={{marginLeft: 10, marginTop: 10}}>Zohar</p>
                                            </div>
                                            <div>
                                                <Field
                                                    name={'timing.zohar'}
                                                    component={MobileTimePicker}
                                                    renderInput={(params) => <TextField style={TIMEINPUT} {...params} />}
                                                    onChange={(e) => setFieldValue("timing.zohar", moment(e).format('hh:mm A'))}
                                                    value={(moment(values.timing.zohar, 'hh:mm A').isValid() ? moment(values.timing.zohar, 'hh:mm A') : values.timing.zohar)}
                                                />
                                                {/*<input*/}
                                                {/*    onChange={handleChange("timing")}*/}
                                                {/*    value={values['timing.zohar']}*/}
                                                {/*    onBlur={handleBlur("timing")}*/}
                                                {/*    style={TIMEINPUT}*/}
                                                {/*    placeholder="00:00 AM"*/}
                                                {/*/>*/}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingBlockEnd: 10,
                                            }}
                                        >
                                            <div style={{'align-self': 'center'}}>
                                                <p style={{marginLeft: 10, marginTop: 10}}>Asar</p>
                                            </div>
                                            <div>
                                                <Field
                                                    name={'timing.asar'}
                                                    component={MobileTimePicker}
                                                    renderInput={(params) => <TextField style={TIMEINPUT} {...params} />}
                                                    onChange={(e) => setFieldValue("timing.asar", moment(e).format('hh:mm A'))}
                                                    value={(moment(values.timing.asar, 'hh:mm A').isValid() ? moment(values.timing.asar, 'hh:mm A') : values.timing.asar)}
                                                />
                                                {/*<input*/}
                                                {/*    onChange={handleChange("timing")}*/}
                                                {/*    value={values['timing.asar']}*/}
                                                {/*    onBlur={handleBlur("timing")}*/}
                                                {/*    style={TIMEINPUT}*/}
                                                {/*    placeholder="00:00 AM"*/}
                                                {/*/>*/}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingBlockEnd: 10,
                                            }}
                                        >
                                            <div style={{'align-self': 'center'}}>
                                                <p style={{marginLeft: 10, marginTop: 10}}>Magrib</p>
                                            </div>
                                            <div>
                                                <Field
                                                    name={'timing.magrib'}
                                                    component={MobileTimePicker}
                                                    renderInput={(params) => <TextField style={TIMEINPUT} {...params} />}
                                                    onChange={(e) => setFieldValue("timing.magrib", moment(e).format('hh:mm A'))}
                                                    value={(moment(values.timing.magrib, 'hh:mm A').isValid() ? moment(values.timing.magrib, 'hh:mm A') : values.timing.magrib)}
                                                />
                                                {/*<input*/}
                                                {/*    onChange={handleChange("timing")}*/}
                                                {/*    value={values['timing.magrib']}*/}
                                                {/*    onBlur={handleBlur("timing")}*/}
                                                {/*    style={TIMEINPUT}*/}
                                                {/*    placeholder="00:00 AM"*/}
                                                {/*/>*/}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                paddingBlockEnd: 10,
                                            }}
                                        >
                                            <div style={{'align-self': 'center'}}>
                                                <p style={{marginLeft: 10, marginTop: 10}}>Isha</p>
                                            </div>
                                            <div>
                                                <Field
                                                    name={'timing.isha'}
                                                    component={MobileTimePicker}
                                                    renderInput={(params) => <TextField style={TIMEINPUT} {...params} />}
                                                    onChange={(e) => setFieldValue("timing.isha", moment(e).format('hh:mm A'))}
                                                    value={(moment(values.timing.isha, 'hh:mm A').isValid() ? moment(values.timing.isha, 'hh:mm A') : values.timing.isha)}
                                                />
                                                {/*<input*/}
                                                {/*    onChange={handleChange("timing")}*/}
                                                {/*    value={values['timing.isha']}*/}
                                                {/*    onBlur={handleBlur("timing")}*/}
                                                {/*    style={TIMEINPUT}*/}
                                                {/*    placeholder="00:00 AM"*/}
                                                {/*/>*/}
                                            </div>
                                        </div>
                                        {errors.timing && <p>{errors.timing}</p>}
                                        <div>
                                            <img
                                                alt="masjid"
                                                style={{alignSelf: "center"}}
                                                width={250}
                                                height={200}
                                                src={values.pictureURL}
                                            />
                                        </div>
                                    </div>
                                </LocalizationProvider>
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
                            <MyComponent index={index} item={item}/>
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
