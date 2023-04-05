import React from 'react';

const ErrorContext = React.createContext({
  errors: [],
  setErrors: (_: any) => {},
});

export default ErrorContext;
