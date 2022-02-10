import { Content } from "./";
import React from "react";
const EmptyLayout = ({ children, ...restProps }) => {
    return (
      <main className="sr-app bg-light" {...restProps}>
        <Content maxWidth="xl">{children}</Content>
      </main>
    );
};

export default EmptyLayout;
