import React from 'react';
import { CircularProgress } from '@material-ui/core';

/* screen loader, to show users that we are loading */
const PageSpinner = ({ color = 'primary', children }) => {
  return (
    <div className="sr-page-spinner">
      <CircularProgress color={color} />
      {children}
    </div>
  );
};

export default PageSpinner;
