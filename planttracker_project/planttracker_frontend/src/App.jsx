import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';


function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(Boolean(localStorage.getItem('planttrackerAccess')));
  return (
  <div>
  <Header className="relative" props={{ isLoggedIn, setIsLoggedIn }}/>
  <div className="bg-citrine flex flex-col mt-[10vh]" id="detail">
  <Outlet context={[isLoggedIn, setIsLoggedIn]}/>
  </div>
  </div>
  )
}

export default App;
