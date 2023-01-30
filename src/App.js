import './App.css';
import { Route, Routes } from 'react-router-dom';
import Billing from './Pages/Billing';
import { Toaster } from 'react-hot-toast';
import UpdateBilling from './Pages/UpdateBilling';
import Signup from './Pages/Signup';
import Login from './Pages/Login';


function App() {
  const userToken = localStorage.getItem('accessToken');
  console.log(userToken);
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path='/' element={userToken ? <Billing /> : <Login />}></Route>
        <Route path='/update-billing/:id' element={userToken ? <UpdateBilling /> : <Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App;
