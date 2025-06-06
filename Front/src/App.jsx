import { Login } from './pages/auth/Login';
import { Page404 } from './pages/page404';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Profile } from './pages/client/profile';

import { Home } from './pages/client/home';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'sonner';
import { RoomForm } from './pages/admin/RoomForm';
import { PageRoom } from './pages/client/PageRoom';
import supabase from './utils/supabase';
import { Reservation } from './pages/client/Reservation';


function App() {
  const navigate = useNavigate()
  const { setAuth } = useContext(AuthContext)

  useEffect(() => {
    supabase.auth.onAuthStateChange((e, _session) => {
      console.log('Auth state changed:', e, _session)

      if (!_session) { navigate('/login') }
      else {
        // check user role
        const manageSign = async () => {
          const { data, error } = await supabase.from('user').select('*').eq('code', _session.user.id)

          if (error) {
            console.error('Error fetching user role:', error)
            return
          }

          // save user data in context
          const userData = {
            _session,
            user_info: data[0]
          }
          setAuth(userData)

          const role = data?.[0]?.role
          console.log('User role:', role)
          if (role === 'client' && location.pathname === '/login') {
            navigate('/')
          } else if (role === 'admin' && location.pathname === '/admin') {
            navigate('/')

          }
        }
        manageSign()
      }
    })
  }, [])


  return (
    <>
      <Toaster expand={true} richColors toastOptions={{
        style: {
          padding: '25px',
        }
      }} />
      <Routes>

        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin' element={<RoomForm />} />
        <Route path='*' element={<Page404 />} />
        <Route path='/room/:idType' element={<PageRoom />}></Route>
        <Route path='/reservation' element={< Reservation />}></Route>

      </Routes>
    </>
  );
}

export default App