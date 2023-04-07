import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';



function App() {
  let location = useLocation();
  return (
  <>
  <Header/>
  <div id="detail">
  <Outlet props={{location, useLocation}}/>
  </div>
  </>
  )
}

export default App;
