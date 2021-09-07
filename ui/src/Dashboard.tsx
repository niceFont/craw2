import React from 'react';
import {Link} from 'react-router-dom';
import MainContainer from './components/MainContainer';
import withAuth from './helpers';


const Dashboard = () => {
  return (
    <MainContainer>
      <Link to="/board/dawda">Create Board</Link>
      <div>
        <ul>
          <li>Board 1</li>
          <li>Board 2</li>
        </ul>
      </div>
    </MainContainer>
  );
};

export default Dashboard;
