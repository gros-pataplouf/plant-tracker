import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer'

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(Boolean(localStorage.getItem('planttrackerAccess')));
  return (
  <div>
  <Header className="relative" props={{ isLoggedIn, setIsLoggedIn }}/>
  <div className="flex flex-col mt-[10vh]" id="detail">
  <Outlet context={[isLoggedIn, setIsLoggedIn]}/>
  </div>
  <Footer props={{ isLoggedIn, setIsLoggedIn }}/>

  </div>
  )
}

export default App;
