import React from "react";

import { Container } from "@material-ui/core";


const Content = ({ tag: Tag, ...restProps }) => {

  return <Tag {...restProps} className="sr-content" maxWidth="xl" style={{padding:0}} />;
};

Content.defaultProps = {
  tag: Container
};

export default Content;
