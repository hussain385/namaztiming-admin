import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Request from "../pages/Request";
import {useSelector} from "react-redux";
import {isEmpty, isLoaded} from "react-redux-firebase";
import MasjidList from "../pages/masjid-list";
import Login from "../pages/Login";
import Layout from "./layout/Layout";
import NotFound from "../pages/not-found";
import Loading from "../pages/loading";
import AdminRequest from "../pages/AdminRequest";
import AddMasjid from "../pages/AddMasjid";
import SignUp from "../pages/signUp";
import {AuthProvider, useFirebaseApp} from "reactfire";
import {getAuth} from "@firebase/auth";
import ForgotPassword from "../pages/forgotPassword";

// import {getAuth} from "firebase/auth";

function PrivateRoute({children, ...rest}) {
    const {auth, profile, isInitializing} = useSelector(
        (state) => state.firebase
    );
    console.log("PrivateRoute children", children, rest);

    return (
        <Route
            {...rest}
            render={(props) =>
                isInitializing || (isEmpty(profile) && !isLoaded(profile)) ? (
                    <Layout extra={props}>
                        <Loading/>
                    </Layout>
                ) : isLoaded(auth) && !isEmpty(auth) && profile.isAdmin ? (
                    <Layout extra={props}>{children}</Layout>
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: props.location},
                        }}
                    />
                )
            }
        />
    );
}

const Routes = () => {
    const app = useFirebaseApp();
    const auth = getAuth(app);
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/forgotPassword" component={ForgotPassword}/>

                {/*    <DatabaseProvider sdk={database}>*/}
                <Route path="/SignUp" component={() => (
                    <AuthProvider sdk={auth}>
                        <SignUp/>
                    </AuthProvider>
                )}/>
                {/*    </DatabaseProvider>*/}

                <PrivateRoute path="/" exact>
                    <Dashboard/>
                </PrivateRoute>
                <PrivateRoute path="/masjidList" exact>
                    <MasjidList/>
                </PrivateRoute>
                <PrivateRoute path="/request" exact>
                    <Request/>
                </PrivateRoute>
                <PrivateRoute path="/admin-request" exact>
                    <AdminRequest/>
                </PrivateRoute>
                <PrivateRoute path="/add-masjid" exact>
                    <AddMasjid/>
                </PrivateRoute>
                <PrivateRoute path="/">
                    <NotFound/>
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
    );
};

export default Routes;
