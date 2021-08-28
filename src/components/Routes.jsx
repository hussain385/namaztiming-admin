import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Request from "../pages/Request";

const Routes = () => {
  return (
    <>
      <Route path="/" exact component={Dashboard} />
      <Route path="/customers" component={Customers} />
      <Route path="/request" component={Request} />
    </>
  );
};

export default Routes;
