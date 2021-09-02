import React from 'react';
import {useRecoilValue} from 'recoil';
import {Redirect} from 'react-router-dom';
import {user} from '../store/atoms';


function WithAuth<P>(WrappedComponent : React.ComponentType<P>) {
  const userObject = useRecoilValue(user);
  const component = (props: P) => {
    return userObject && userObject.isLoggedIn ? <WrappedComponent {...props} /> : <Redirect to='/login'/>;
  };

  return component;
};

export default WithAuth;
