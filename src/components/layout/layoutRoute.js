import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { Footer } from "./";
import PageSpinner from "../PageSpinner";

const LayoutRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Suspense fallback={<PageSpinner />}>
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
          <Footer />
        </Layout>
      )}
    />
  </Suspense>
);

export default LayoutRoute;
