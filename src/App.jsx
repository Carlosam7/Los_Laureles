import { Login } from './pages/auth/Login';
import { Page404 } from './pages/page404';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Profile } from './pages/client/profile';
import {Reservation} from './pages/client/Reservation';
import supabase from './utils/supabase.js';



function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/reservation');
      } else {
        navigate('/profile');
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <>
      <Routes>
        <Route path='/reservation' element={<Reservation />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  );
}

export default App