import supabase from './utils/supabase';
import { Login } from './pages/auth/Login';
import { Page404 } from './pages/page404';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Profile } from './pages/client/profile';

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((e, session) => {
      if (!session) { navigate('/login') }
      else { navigate('/profile') }
    })

    const getSession = async () => {
      const session = await supabase.auth.getSession()
      console.log(session)
    } 
    getSession()

  }, [])
 
  return (
    <>
      <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='*' element={<Page404/>}/>
      </Routes>
    </>
  )
}

export default App