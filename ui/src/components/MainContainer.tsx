import React from 'react';


const MainContainer = ({children} : React.PropsWithChildren<{}>) => {
  return <div className="bg-white rounded-md h-80 p-12 w-2/3 ml-auto mr-auto">
    {children}
  </div>;
};


export default MainContainer;
