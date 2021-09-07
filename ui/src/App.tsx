/* eslint-disable require-jsdoc */
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Board from './Board';
import Login from './Login';
import Navbar from './components/Navbar';
import Home from './Home';
import NotFound from './404';
import {useRecoilState} from 'recoil';
import {userAtom} from './store/atoms';
import Dashboard from './Dashboard';
import {getSession} from './helpers/user';

function App() {
  const [storeSession, setSession] = useRecoilState(userAtom);

  React.useEffect(() => {
    if (!storeSession?.isLoggedIn) {
      getSession().then((session) => {
        if (session) setSession(session);
      });
    }
  }, [storeSession]);
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
        <Route path="/dashboard">
          <Dashboard></Dashboard>
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
