
import './style.scss';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


function App() {

const {currentUser} = useContext(AuthContext);
console.log(currentUser);

const ProtectedRoute = ({children}) => {
  if(!currentUser) {
    return <Navigate to='/login' />
  }
  console.log('children==', children);
  return children;
}

  return (

    <HashRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
      </HashRouter>

  );
}

export default App;
