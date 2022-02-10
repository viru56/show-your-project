import React from 'react';

/* this is a HOC, we are using it in every page */
const Page = ({
  className,
  children,
}) => {
  const classes = `sr-page ${className}`
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Page;
