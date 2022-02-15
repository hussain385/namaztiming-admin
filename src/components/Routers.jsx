import React from 'react';
import { BrowserRouter, Redirect, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Request from '../pages/Request';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import MasjidList from '../pages/masjid-list';
import Login from '../pages/Login';
import Layout from './layout/Layout';
import NotFound from '../pages/not-found';
import Loading from '../pages/loading';
import AdminRequest from '../pages/AdminRequest';
import AddMasjid from '../pages/AddMasjid';
import SignUp from '../pages/signUp';
import { AuthProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from '@firebase/auth';
import ForgotPassword from '../pages/forgotPassword';
import SuccessPage from '../pages/SuccessPage';
import TimeRequests from '../pages/TimeRequests';
import TermsCondition from '../pages/Terms&Condition';
import ContactUs from '../pages/ContactUs';

// import {getAuth} from "firebase/auth";

function RequireAuth({ children }) {
  const { auth, profile, isInitializing } = useSelector(
    state => state.firebase,
  );
  if (isInitializing || (isEmpty(profile) && !isLoaded(profile))) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  } else if (isLoaded(auth) && !isEmpty(auth) && profile.isAdmin) {
    return <Layout>{children}</Layout>;
  } else {
    return <Navigate />;
  }
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

const Routers = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/term_conditions">
          <TermsCondition />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/forgotPassword">
          <ForgotPassword />
        </Route>
        <Route path="/success-page">
          <SuccessPage />
        </Route>
        {/*    <DatabaseProvider sdk={database}>*/}
        <Route path="/SignUp">
          <AuthProvider sdk={auth}>
            <SignUp />
          </AuthProvider>
        </Route>
        <PrivateRoute path="/" exact>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/masjidList" exact>
          <MasjidList />
        </PrivateRoute>
        <PrivateRoute path="/contact-us" exact>
          <ContactUs />
        </PrivateRoute>
        <PrivateRoute path="/request" exact>
          <Request />
        </PrivateRoute>
        <PrivateRoute path="/admin-request" exact>
          <AdminRequest />
        </PrivateRoute>
        <PrivateRoute path="/add-masjid" exact>
          <AddMasjid />
        </PrivateRoute>
        <PrivateRoute path="/time-requests" exact>
          <TimeRequests />
        </PrivateRoute>
        <PrivateRoute path="/">
          <NotFound />
        </PrivateRoute>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
