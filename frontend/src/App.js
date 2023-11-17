import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import ChangePassword from './pages/ChangePassword';
import '../src/css/App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route
              path='/'
              element={<Login/>}
            />
            <Route
              path='/signup'
              element={<Signup/>}
            />
            <Route
              path='/home'
              element={<Home/>}
            />
            <Route
              path='/create-event'
              element={<CreateEvent/>}
            />
            <Route
              path='/eventdetail'
              element={<EventDetail/>}
            />
            <Route
              path='/changepassword'
              element={<ChangePassword/>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
