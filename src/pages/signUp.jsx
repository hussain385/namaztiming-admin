import React, { useEffect, useState } from "react";
import "./login.css";
import { useUser } from "reactfire";
import firebase from "firebase/compat";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardHeader,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Form, Formik } from "formik";
import * as PropTypes from "prop-types";

const ERROR = {
  color: "darkred",
  fontSize: 12,
  marginTop: -25,
  marginLeft: 50,
  marginBottom: 25,
};

const SetPasswordSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Password Confirmation is required")
    .oneOf([Yup.ref("password"), null], "password must match"),
});

Formik.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.shape({
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }),
  children: PropTypes.func,
};

function SignUp() {
  const { status, data: user, error: userError } = useUser();
  const params = new URLSearchParams(window.location.search);
  const [error, setError] = useState(null);
  // const [render, setRender] = useState(null);
  const db = firebase.firestore();
  const history = useHistory();

  useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = params.get("userEmail") || "";
      }
      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then(async () => {
          // Clear email from storage.
          // const token = await result.user.getIdToken(true)
          // await firebase.auth().signOut()
          // console.log(token, result.user.email)
          // await login({
          //     // email: result.user.email,
          //     token,
          //     profile: {email: result.user.email}
          // })

          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch((error) => {
          console.log(error.message);
          setError(error.message);
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }, []);

  // function resetAndRoute() {
  //     firebase.auth().sendPasswordResetEmail(user.email).then(r => {
  //         history.push('/forgotPassword')
  //     })
  // }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error</span>;
  }
  if (userError) {
    return <div>{JSON.stringify(userError)}</div>;
  }

  if (
    status === "success" &&
    params.get("userName") &&
    params.get("userPhone") &&
    params.get("masjidId") &&
    user
  ) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((value) => {
        console.log(value);
        if (value.exists) {
          console.log("exist");
          db.collection("Masjid")
            .doc(params.get("masjidId"))
            .update({
              adminId: user.uid,
            })
            .then((e) => {
              // setSent(true);
              console.log(e);
              history.push("/done");
            })
            .catch((reason) => {
              console.log(reason);
            });
        }
      });
    return (
      <Container
        component={"main"}
        maxWidth={"xs"}
        sx={{ display: "flex", height: "100vh" }}
      >
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SetPasswordSchema}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            if (values.password !== values.confirmPassword) {
              return null;
            }
            setSubmitting(true);

            firebase
              .auth()
              .currentUser.updatePassword(values.password)
              .then((r) => {
                db.collection("users")
                  .doc(user.uid)
                  .set({
                    name: decodeURI(params.get("userName")),
                    phone: decodeURI(params.get("userPhone")),
                    email: decodeURI(params.get("userEmail")),
                    isAdmin: false,
                  })
                  .then((r) => {
                    // resetAndRoute();
                    
                      db.collection("Masjid")
                        .doc(params.get("masjidId"))
                        .update({
                          adminId: user.uid,
                        })
                        .then((value) => setSubmitting(false));
                    
                  });
              });
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
            <Card
              component={Form}
              sx={{
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                width: "100%",
                alignItems: "center",
                p: 4,
              }}
            >
              <CardHeader title={"Set Password"} />
              <TextField
                margin={"normal"}
                label={"Password"}
                name={"password"}
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />
              <TextField
                margin={"normal"}
                label={"Confirm Password"}
                name={"confirmPassword"}
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
              />
              {errors.firebase && <p style={ERROR}>{errors.firebase}</p>}
              {/*{authError && <p style={ERROR}>{JSON.stringify(authError)}</p>}*/}
              <LoadingButton
                onClick={handleSubmit}
                type={"submit"}
                variant={"contained"}
                loading={isSubmitting}
              >
                Submit
              </LoadingButton>
              {/*<Button*/}
              {/*    onClick={handleSubmit}*/}
              {/*    type="submit"*/}
              {/*    className="submit"*/}
              {/*    disabled={isSubmitting}*/}
              {/*    variant={"contained"}*/}
              {/*>*/}
              {/*    {isSubmitting ? (*/}
              {/*        <CircularProgress height={12} width={40}/>*/}
              {/*    ) : (*/}
              {/*        <p>Submit</p>*/}
              {/*    )}*/}
              {/*</Button>*/}
            </Card>
          )}
        </Formik>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        textAlign: "center",
      }}
    >
      <Typography>Something Went wrong please check your link</Typography>
    </Container>
  );
}

export default SignUp;
