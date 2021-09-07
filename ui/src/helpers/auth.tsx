import React from 'react';
import {useRecoilValue} from 'recoil';
import {Redirect} from 'react-router-dom';
import {userAtom} from '../store/atoms';


function WithAuth<P>(WrappedComponent : React.ComponentType<P>) {
  const user = useRecoilValue(userAtom);
  const component = (props: P) => {
    return user && user.isLoggedIn ? <WrappedComponent {...props} /> : <Redirect to='/login'/>;
  };

  return component;
};

export default WithAuth;
