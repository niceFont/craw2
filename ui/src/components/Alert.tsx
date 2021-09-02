import React from 'react';

export enum AlertTypes {
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning'
}
interface AlertProps {
  message: string,
  type: AlertTypes
}

const colorMapper = (type : AlertTypes) => {
  switch (type) {
    case AlertTypes.SUCCESS:
      return 'green';
    case AlertTypes.INFO:
      return 'blue';
    case AlertTypes.WARNING:
      return 'yellow';
    case AlertTypes.ERROR:
      return 'red';
    default:
      return 'gray';
  }
};

const Alert = ({message, type} : AlertProps) => {
  return (
    <div
      className={`bg-${colorMapper(type)}-200 px-6 py-4 my-4 rounded-md text-lg flex items-center mx-auto w-full`}
    >
      <span className={`text-${colorMapper(type)}-800`}>{message}</span>
    </div>
  );
};

export default Alert;
