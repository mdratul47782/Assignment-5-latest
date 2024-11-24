import React from 'react';

const getChildId = (children) => {
  const child = React.Children.only(children);
  return child?.props?.id || 'default-id';  // Fallback ID if none is provided
};

const Field = ({ label, children, htmlFor, error }) => {
  const id = htmlFor || getChildId(children);

  return (
    <div className="form-control">
      {label && (
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
      )}
      {children}
      {error && error.message && (
        <div role="alert" className="text-red-600">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default Field;
