import React from "react";
import {Redirect, Route} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Request from "../pages/Request";
import {useSelector} from "react-redux";
import {isEmpty, isLoaded} from "react-redux-firebase";
import notFound from "../pages/404";
import Example from "../pages/example";

function PrivateRoute({children, ...rest}) {
    const {auth, profile} = useSelector(state => state.firebase)
    return (
        <Route
            {...rest}
            render={({location}) =>
                isLoaded(auth) && !isEmpty(auth) && profile.isAdmin ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

const Routes = () => {
    return (
        <>
            <PrivateRoute path="/" exact component={Dashboard}/>
            <PrivateRoute path="/customers" exact component={Customers}/>
            <PrivateRoute path="/request" exact component={Request}/>
            <PrivateRoute path="/example" exact component={Example}/>
            <PrivateRoute path='/' component={notFound}/>
        </>
    );
};

export default Routes;
