import React from 'react';
import {useFirebase} from "react-redux-firebase";
import "./login.css";
import * as Yup from "yup";
import {Formik} from "formik";
import Loader from "react-loader-spinner";
import {useSelector} from "react-redux";

const ForgotPasswordSchema = Yup.object().shape({
    // email: Yup.string().email().required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string().required("Password Confirmation is required").oneOf([Yup.ref('password'), null], 'password must match'),
});

const ERROR = {
    color: "darkred",
    fontSize: 12,
    marginTop: -25,
    marginLeft: 50,
    marginBottom: 25,
};

function ForgotPassword(props) {
    const Firebase = useFirebase();
    const themeReducer = useSelector((state) => state.ThemeReducer);
    const params = new URLSearchParams(window.location.search);
    // const {authError} = useSelector(state => state.firebase)
    return (
        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
            <div className="main_body">
                <div className="main">
                    <p className="sign" align="center">
                        Password Reset
                    </p>
                    <Formik
                        initialValues={{
                            // email: "",
                            password: "",
                            confirmPassword: '',
                        }}
                        validationSchema={ForgotPasswordSchema}
                        onSubmit={async (values, {setSubmitting, setFieldError}) => {
                            if (params.get("oobCode")) {
                                try {
                                    const res = await Firebase.confirmPasswordReset(params.get("oobCode"), values.password)
                                    console.log(res)
                                } catch (reason) {
                                    setFieldError("firebase", reason.message);
                                }

                            }
                            setSubmitting(false);
                        }}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              /* and other goodies */
                          }) => (
                            <form className="form1">
                                {/*<input*/}
                                {/*    type="email"*/}
                                {/*    name="email"*/}
                                {/*    onChange={handleChange}*/}
                                {/*    onBlur={handleBlur}*/}
                                {/*    value={values.email}*/}
                                {/*    placeholder="Enter Your Email..."*/}
                                {/*    className="un "*/}
                                {/*/>*/}
                                {/*<br/>*/}
                                {/*{errors.email && touched.email && (*/}
                                {/*    <p style={ERROR}>{errors.email}</p>*/}
                                {/*)}*/}
                                <input
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className="pass"
                                    placeholder="Enter Your Password..."
                                />
                                <br/>
                                {/*{JSON.stringify(values,null,2)}*/}
                                {errors.password && touched.password && (
                                    <p style={ERROR}>{errors.password}</p>
                                )}
                                <input
                                    name="confirmPassword"
                                    type="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    className="pass"
                                    placeholder="Confirm your Password..."
                                />
                                {/*<button onClick={async (e) => {*/}
                                {/*    e.preventDefault()*/}
                                {/*    if (values.email) await firebase.auth().sendPasswordResetEmail(values.email)*/}
                                {/*}}>Resend Code</button>*/}
                                <br/>
                                {/*{JSON.stringify(values,null,2)}*/}
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <p style={ERROR}>{errors.confirmPassword}</p>
                                )}
                                {errors.firebase && <p style={ERROR}>{errors.firebase}</p>}
                                {/*{authError && <p style={ERROR}>{JSON.stringify(authError)}</p>}*/}
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Loader type="Puff" color="white" height={12} width={40}/>
                                    ) : (
                                        <p>Submit</p>
                                    )}
                                </button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
