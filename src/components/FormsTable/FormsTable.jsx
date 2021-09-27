import React, {useState} from "react";
import {useFirebase} from "react-redux-firebase";
import {Field, Form, Formik} from "formik";
import {MasjidSchema} from "../../services/validation";
import {LocalizationProvider, MobileTimePicker} from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterMoment";
import {TextField} from "@mui/material";
import moment from "moment";
import PropTypes from 'prop-types';

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
    // const {masjidData, preButton: {onClick: preButtonClick, text: preButtonText}, onSubmit} = props
    const masjidData = props.masjidData || null
    const firebase = useFirebase()
    const [path, setPath] = useState('')
    const filePath = 'MasjidUploads'
    const [image, setImage] = useState(masjidData?.pictureURL);
    // console.log(JSON.stringify(masjidData))
    const onImageChange = async (event, setFieldValue) => {
        if (event.target.files && event.target.files[0]) {
            console.log(event.target.files[0])
            setImage(URL.createObjectURL(event.target.files[0]))
            setFieldValue('pictureURL',event.target.files[0])
            // firebase.uploadFile(filePath, event.target.files[0]).then(snapshot => {
            //     setPath(snapshot.uploadTaskSnaphot._delegate.metadata.fullPath);
            //     snapshot.uploadTaskSnaphot.ref.getDownloadURL().then(url => {
            //         value = url
            //         handleChange(url);
            //         console.log(' * new url', url)
            //         setImage(url);
            //     })
            // })
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
                name: masjidData?.name,
                address: masjidData?.address,
                gLink: masjidData?.gLink,
                pictureURL: masjidData?.pictureURL,
                userEmail: masjidData?.user?.email,
                userName: masjidData?.user?.name,
                userPhone: masjidData?.user?.phone,
                latitude: masjidData?.g?.geopoint._lat,
                longitude: masjidData?.g?.geopoint._long,
                timing: {
                    isha: masjidData?.timing?.isha || moment.utc().format('hh:mm A'),
                    fajar: masjidData?.timing?.fajar || moment.utc().format('hh:mm A'),
                    zohar: masjidData?.timing?.zohar || moment.utc().format('hh:mm A'),
                    asar: masjidData?.timing?.asar || moment.utc().format('hh:mm A'),
                    magrib: masjidData?.timing?.magrib || moment.utc().format('hh:mm A'),
                },
            }}
            validationSchema={MasjidSchema}
            onSubmit={props.onSubmit}
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
                <Form>
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
                        <p style={{marginLeft: 10, marginTop: 10}}>Admin Phone Number</p>
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
                        <div style={{display: "flex", justifyContent: "space-between"}}>
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
                                        <p style={{marginLeft: 10, marginTop: 10,}}>Fajar</p>
                                    </div>
                                    <div>
                                        <MobileTimePicker
                                            name={"timing.fajar"}
                                            onChange={(e) => setFieldValue("timing.fajar", moment(e).format('hh:mm A'))}
                                            value={(moment(values.timing.fajar, 'hh:mm A').isValid() ? moment(values.timing.fajar, 'hh:mm A') : values.timing.fajar)}
                                            renderInput={(params) => <TextField
                                                style={TIMEINPUT} {...params} />}
                                        />
                                        {errors.timing?.fajar && touched.timing?.fajar && (
                                            <p style={ERROR}>{errors.timing?.fajar}</p>
                                        )}
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
                                            renderInput={(params) => <TextField
                                                style={TIMEINPUT} {...params} />}
                                            onChange={(e) => setFieldValue("timing.zohar", moment(e).format('hh:mm A'))}
                                            value={(moment(values.timing.zohar, 'hh:mm A').isValid() ? moment(values.timing.zohar, 'hh:mm A') : values.timing.zohar)}
                                        />
                                        {errors.timing?.zohar && touched.timing?.zohar && (
                                            <p style={ERROR}>{errors.timing?.zohar}</p>
                                        )}
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
                                            renderInput={(params) => <TextField
                                                style={TIMEINPUT} {...params} />}
                                            onChange={(e) => setFieldValue("timing.asar", moment(e).format('hh:mm A'))}
                                            value={(moment(values.timing.asar, 'hh:mm A').isValid() ? moment(values.timing.asar, 'hh:mm A') : values.timing.asar)}
                                        />
                                        {errors.timing?.asar && touched.timing?.asar && (
                                            <p style={ERROR}>{errors.timing?.asar}</p>
                                        )}
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
                                            renderInput={(params) => <TextField
                                                style={TIMEINPUT} {...params} />}
                                            onChange={(e) => setFieldValue("timing.magrib", moment(e).format('hh:mm A'))}
                                            value={(moment(values.timing.magrib, 'hh:mm A').isValid() ? moment(values.timing.magrib, 'hh:mm A') : values.timing.magrib)}
                                        />
                                        {errors.timing?.magrib && touched.timing?.magrib && (
                                            <p style={ERROR}>{errors.timing?.magrib}</p>
                                        )}
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
                                            renderInput={(params) => <TextField
                                                style={TIMEINPUT} {...params} />}
                                            onChange={(e) => setFieldValue("timing.isha", moment(e).format('hh:mm A'))}
                                            value={(moment(values.timing.isha, 'hh:mm A').isValid() ? moment(values.timing.isha, 'hh:mm A') : values.timing.isha)}
                                        />
                                        {errors.timing?.isha && touched.timing?.isha && (
                                            <p style={ERROR}>{errors.timing?.isha}</p>
                                        )}
                                    </div>
                                </div>
                                {errors.timing && <p>{JSON.stringify(errors.timing)}</p>}
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
                                            style={{fontSize: "100px", color: "#a6a6a6"}}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => onImageChange(e, setFieldValue)}
                                        className="filetype"
                                        style={{width: "92px", marginTop: "15px"}}
                                    />
                                    {errors.pictureURL && <p style={ERROR}>{errors.pictureURL}</p>}
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
                        {props.preButton?.onClick && props.preButton?.text &&
                        <button
                            style={{
                                width: 70,
                                color: "white",
                                borderRadius: 7,
                                height: 30,
                                marginRight: 20,
                                backgroundColor: "darkred",
                            }}
                            onClick={props.preButton?.onClick}
                        >
                            {props.preButton?.text}
                        </button>
                        }
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
                </Form>
            )}
        </Formik>
    );
};

FormsTable.propTypes = {
    masjidData: PropTypes.shape({
        "user": PropTypes.shape({
            "id": PropTypes.string,
            "phone": PropTypes.string,
            "name": PropTypes.string,
            "isAdmin": PropTypes.bool,
            "email": PropTypes.string,
        }),
        "adminId": PropTypes.string,
        "name": PropTypes.string,
        "g": PropTypes.shape({
            "geohash": PropTypes.string,
            "geopoint": PropTypes.shape({
                "latitude": PropTypes.number,
                "longitude": PropTypes.number,
            }),
        }),
        "pictureURL": PropTypes.string,
        "address": PropTypes.string,
        "id": PropTypes.string,
        "timing": PropTypes.shape({
            "isha": PropTypes.string,
            "fajar": PropTypes.string,
            "zohar": PropTypes.string,
            "asar": PropTypes.string,
            "magrib": PropTypes.string,
        }),
    }),
    preButton: PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired
    }),
    onSubmit: PropTypes.func.isRequired
};


export default FormsTable;
