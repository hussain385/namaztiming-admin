import React, { useEffect, useState } from "react";
import "./login.css";
import { useUser } from "reactfire";
import firebase from "firebase/compat";

const ERROR = {
  color: "darkred",
  fontSize: 12,
  marginTop: -25,
  marginLeft: 50,
  marginBottom: 25,
};

function SignUp() {
  const { status, data: user, error: userError } = useUser();
  const params = new URLSearchParams(window.location.search);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

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
        .then(async (result) => {
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

  if (
    status === "success" &&
    params.get("userName") &&
    params.get("userPhone") &&
    params.get("masjidId") &&
    user &&
    !sent
  ) {
    console.log(status);
    console.log(user);
    console.log(userError);
    const db = firebase.firestore();
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((value) => {
        if (value.exists) {
          return db
            .collection("Masjid")
            .doc(params.get("masjidId"))
            .update({
              adminId: user.uid,
            })
            .then((r) => {
              setSent(true);
            });
        }
        db.collection("users")
          .doc(user.uid)
          .set({
            name: decodeURI(params.get("userName")),
            phone: decodeURI(params.get("userPhone")),
            isAdmin: false,
          })
          .then((r) => {
            firebase
              .auth()
              .sendPasswordResetEmail(user.email)
              .then((r) => {
                db.collection("Masjid")
                  .doc(params.get("masjidId"))
                  .update({
                    adminId: user.uid,
                  })
                  .then((r) => {
                    setSent(true);
                  });
              });
          });
      });
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error</span>;
  }

  return <span>Please Check Your Email</span>;
}

export default SignUp;
