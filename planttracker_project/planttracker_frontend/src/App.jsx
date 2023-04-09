import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';


function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(Boolean(localStorage.getItem('planttrackerAccess')));
  return (
  <>
  <Header props={{ isLoggedIn, setIsLoggedIn }}/>
  <div id="detail">
  <Outlet context={[isLoggedIn, setIsLoggedIn]}/>
  </div>
  </>
  )
}

export default App;
