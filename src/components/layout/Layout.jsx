import React, {useEffect} from "react";
import "./layout.css";
import Sidebar from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Routes from "../Routes";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import ThemeAction from "../../redux/actions/ThemeAction";
import Login from "../../pages/Login";
import {isEmpty, isLoaded} from "react-redux-firebase";

const Layout = () => {
    const themeReducer = useSelector((state) => state.ThemeReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        const themeClass = localStorage.getItem("themeMode", "theme-mode-light");
        const colorClass = localStorage.getItem("colorMode", "theme-mode-light");
        dispatch(ThemeAction.setMode(themeClass));
        dispatch(ThemeAction.setColor(colorClass));
    }, [dispatch]);

    function PrivateRoute({ children, ...rest }) {
        const auth = useSelector(state => state.firebase.auth)
        return (
            <Route
                {...rest}
                render={({ location }) =>
                    isLoaded(auth) && !isEmpty(auth) ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
                }
            />
        );
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <PrivateRoute
                    render={(props) => (
                        <div
                            className={`layout ${themeReducer.mode} ${themeReducer.color}`}
                        >
                            <Sidebar {...props} />
                            <div className="layout__content">
                                <TopNav/>
                                <div className="layout__content-main">
                                    <Routes/>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </Switch>
        </BrowserRouter>
    );
};

export default Layout;
