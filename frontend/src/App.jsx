import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/elements/Header';
import Footer from './components/elements/Footer'

const classes = {
  wrapper: 'relative 100vh',
  main: 'absolute top-[10vh] flex flex-col h-[80vh] w-screen overflow-clip',

}

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(Boolean(localStorage.getItem('planttrackerAccess')));
  return (
  <div className={classes.wrapper}>
  <Header props={{ isLoggedIn, setIsLoggedIn }}/>
  <div className={classes.main} id="detail">
  <Outlet context={[isLoggedIn, setIsLoggedIn]}/>
  </div>
  <Footer props={{ isLoggedIn, setIsLoggedIn }}/>

  </div>
  )
}

export default App;
