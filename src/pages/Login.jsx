import React, {useEffect} from "react";
import {Formik} from "formik";
import * as Yup from 'yup';
import {isEmpty, isLoaded, useFirebase} from "react-redux-firebase";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const LogInSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = (props) => {
    const firebaseApp = useFirebase();
    const {auth, profile} = useSelector(state => state.firebase);
    const history = useHistory();

    useEffect(() => {
        if (isLoaded(auth) && !isEmpty(auth)) {
            if (profile.isAdmin === false) {
                console.log('not an admin')
                firebaseApp.logout()
            } else {
                if (props.location.state) {
                    console.log('pushing to ' + props.location.state.from.pathname)
                    return history.push(props.location.state.from.pathname)
                    // console.log(props
                }
                console.log('pushing to /')
                return history.push('/')
            }
            console.log('the current user:', auth);
        }
    }, [profile.isAdmin]);

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <Formik
                initialValues={{email: "", password: ""}}
                validationSchema={LogInSchema}
                onSubmit={(values, {setSubmitting}) => {
                    firebaseApp.login({
                        email: values.email,
                        password: values.password,
                    }).then(res => {
                        setSubmitting(false)
                    })
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
                    <form className="flex flex-col-reverse" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        {errors.email && touched.email && errors.email}
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        {errors.password && touched.password && errors.password}
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
