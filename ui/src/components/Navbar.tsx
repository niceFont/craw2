import React from 'react';
import {NavLink} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {User, user as userAtom} from '../store/atoms';

const Navbar = () => {
  const user = useRecoilValue<User | null>(userAtom);
  return (
    <nav className="bg-white items-center justify-between flex align-center mb-[300px] h-14 border-b-4 border-purple-300 w-full">
      <div className="p-4 inline-flex">
        <h1 className="font-bold text-3xl tracking-wider text-gray-600">CRAW</h1>
      </div>
      <div className="flex">
        <div className="mx-2">
          <NavLink exact activeClassName="text-purple-300" to="/">Home</NavLink>
        </div>
        {user && user.isLoggedIn ? (
          <div className="mx-2">
            <NavLink exact activeClassName="text-purple-300" to="/profile"><span className="capitalize">{user.username}</span></NavLink>
          </div>

          ) :
          <div className="mx-2">
            <NavLink exact activeClassName="text-purple-300" to="/login">Login</NavLink>
          </div>
        }
      </div>
    </nav>
  );
};


export default Navbar;
