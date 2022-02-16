import React from 'react';
import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import Dashboard from '../pages/Dashboard';
import Request from '../pages/Request';
import MasjidList from '../pages/masjid-list';
import Login from '../pages/Login';
import Layout from './layout/Layout';
import Loading from '../pages/loading';
import AdminRequest from '../pages/AdminRequest';
import AddMasjid from '../pages/AddMasjid';
import SignUp from '../pages/signUp';
import ForgotPassword from '../pages/forgotPassword';
import SuccessPage from '../pages/SuccessPage';
import TimeRequests from '../pages/TimeRequests';
import TermsCondition from '../pages/Terms&Condition';
import ContactUs from '../pages/ContactUs';

// import {getAuth} from "firebase/auth";

function RequireAuth(props) {
  const { children } = props;
  const { auth, profile, isInitializing } = useSelector(
    (state) => state.firebase,
  );
  if (isInitializing || (isEmpty(profile) && !isLoaded(profile))) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  if (isLoaded(auth) && !isEmpty(auth) && profile.isAdmin) {
    return <Layout>{children}</Layout>;
  }
  return <Navigate to={{ pathname: '/login' }} />;
}

// function PrivateRoute({ children, ...rest }) {
//   const { auth, profile, isInitializing } = useSelector(
//     state => state.firebase,
//   );
//
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         isInitializing || (isEmpty(profile) && !isLoaded(profile)) ? (
//           <Layout extra={props}>
//             <Loading />
//           </Layout>
//         ) : isLoaded(auth) && !isEmpty(auth) && profile.isAdmin ? (
//           <Layout extra={props}>{children}</Layout>
//         ) : (
//           <Redirect
//             to={{
//               pathname: '/login',
//               state: { from: props.location },
//             }}
//           />
//         )
//       }
//     />
//   );
// }

function Routers() {
  // const app = useFirebaseApp();
  // const auth = getAuth(app);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/term_conditions" element={<TermsCondition />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/success-page" element={<SuccessPage />} />
        <Route path="/SignUp" element={<SignUp />} />

        <Route
          path="/"
          element={(
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/contact-us"
          element={(
            <RequireAuth>
              <ContactUs />
            </RequireAuth>
        )}
        />
        <Route
          path="/masjidList"
          element={(
            <RequireAuth>
              <MasjidList />
            </RequireAuth>
          )}
        />

        <Route
          path="/request"
          element={(
            <RequireAuth>
              <Request />
            </RequireAuth>
          )}
        />

        <Route
          path="/admin-request"
          element={(
            <RequireAuth>
              <AdminRequest />
            </RequireAuth>
          )}
        />

        <Route
          path="/add-masjid"
          element={(
            <RequireAuth>
              <AddMasjid />
            </RequireAuth>
          )}
        />

        <Route
          path="/time-requests"
          element={(
            <RequireAuth>
              <TimeRequests />
            </RequireAuth>
          )}
        />

        {/* <Route path="/"> */}
        {/*  <NotFound /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
