import supabase from './utils/supabase';
import { Login } from './pages/auth/Login';
import { Page404 } from './pages/page404';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Profile } from './pages/client/profile';
import { Home } from './pages/client/home';
import { AuthContext } from './context/AuthContext';

function App() {
  const navigate = useNavigate()
  const { auth, setAuth } = useContext(AuthContext)

  useEffect(() => {
    supabase.auth.onAuthStateChange((e, _session) => {
      if (!_session) { navigate('/login') }
      else {
        setAuth(_session)

        // check user role
        const getUserRole = async () => {
          const { data, error } = await supabase.from('user').select('role').eq('code', auth.user.id)

          if (error) {
            console.error('Error fetching user role:', error)
            return
          }

          const role = data?.[0]?.role
          console.log('User role:', role)
          if (role === 'client') {
            navigate('/')
          } else if (role === 'admin') {
            navigate('/')
          }
        }
        getUserRole()
      }
    })
  }, [])

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<Page404 />} />
      </Routes>
    </>
  )
}

export default App