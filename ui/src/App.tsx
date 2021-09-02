/* eslint-disable require-jsdoc */
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Board from './Board';
import Login from './Login';
import Navbar from './components/Navbar';
import Home from './Home';
import NotFound from './404';
import {useSetRecoilState} from 'recoil';
import {user} from './store/atoms';

function App() {
  const setSession = useSetRecoilState(user);
  React.useEffect(() => {
    const getSession = async (): Promise<void> => {
      const res = await fetch(process.env.REACT_APP_AUTH_API + '/me', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
      if (!res.ok) {
        console.log('DIDNT WORK');
      } else {
        const sess = await res.json();
        setSession({
          ...sess,
          isLoggedIn: true,
        });
      }
    };

    getSession();
  }, []);
  return (
    <Router>
      <Navbar></Navbar>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/board/:boardID">
          <Board></Board>
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
