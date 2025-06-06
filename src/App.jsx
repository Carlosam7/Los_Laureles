import supabase from './utils/supabase';
import { Login } from './pages/auth/Login';
import { Page404 } from './pages/page404';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Profile } from './pages/client/profile';
import { Home } from './pages/client/home';
import { AuthContext } from './context/AuthContext';
import { Toaster } from 'sonner';
import { RoomForm } from './pages/admin/RoomForm';

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

          if (userData.user_info.role === 'client') {
            if (userData.user_info.name) {
              navigate('/')
            } else {
              navigate('/profile')
            }
          } else if (userData.user_info.role === 'admin') {
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
      </Routes>
    </>
  )
}

export default App