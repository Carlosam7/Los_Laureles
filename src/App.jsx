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
import { MyReserves } from './pages/admin/ReservesManager';


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
          const { data: userInfo, error: userError } = await supabase.from('user').select('*').eq('code', _session.user.id)

          if (userError) {
            console.error('Error fetching user role:', userError)
            return
          }

          let userData
          if (userInfo.role === 'client') {
            const { data: guestPhone, error: guestError } = await supabase.from('guest').select('phone').eq('code_guest', _session.user.id).single()

            if (guestError) {
              console.error('Error fetching user role:', userError)
              return
            }

            userData = {
              _session,
              user_info: {
                ...userInfo[0],
                phone: guestPhone.phone
              }
            }
          }

          // save user data in context
          userData = {
            _session,
            user_info: {
              ...userInfo[0],
            }
          }
          setAuth(userData)

          const role = userInfo?.[0]?.role
          console.log('User role:', role)
          if (role === 'client' && location.pathname === '/login') {
            navigate('/')
          } else if (role === 'admin' && location.pathname === '/login') {
            navigate('/admin')

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
        <Route path='/myreserves' element={< MyReserves />}></Route>

      </Routes>
    </>
  );
}

export default App