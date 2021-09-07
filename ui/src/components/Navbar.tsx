import React from 'react';
import {NavLink} from 'react-router-dom';
import {useRecoilValue} from 'recoil';
import {User, userAtom} from '../store/atoms';
import DropdownButton from './DropdownButton';

const Navbar = () => {
  const user = useRecoilValue<User | null>(userAtom);
  return (
    <header className="bg-white items-center justify-between flex align-center mb-48 h-14 border-b-4 border-purple-300 w-full">
      <div className="p-4 inline-flex">
        <h1 className="font-bold text-3xl tracking-wider text-gray-600">CRAW</h1>
      </div>
      <nav className="flex items-center">
        <div className="mx-2">
          <NavLink exact activeClassName="text-purple-300" to="/">Home</NavLink>
        </div>
        {user && user.isLoggedIn ? (
          <>
            <div className="mx-2">
              <NavLink exact activeClassName="text-purple-300" to="/dashboard">Dashboard</NavLink>
            </div>
            <div className="mx-2">
              <DropdownButton name="Account">
                <h1>Cool</h1>
              </DropdownButton>
            </div>

          </>
          ) :
          <div className="mx-2">
            <NavLink exact activeClassName="text-purple-300" to="/login">Login</NavLink>
          </div>
        }
      </nav>
    </header>
  );
};


export default Navbar;
