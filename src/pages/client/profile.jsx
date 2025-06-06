import '../../styles/profile_form.css'
import 'primeicons/primeicons.css'
import supabase from '../../utils/supabase'
import { useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { NavBar } from '../../components/atoms/NavBar'

export function Profile() {
  const { auth, setAuth } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [identification, setIdentification] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    if (auth?.user_info) {
      setName(auth.user_info.name || '')
      setLastName(auth.user_info.last_name || '')
      setIdentification(auth.user_info.identification || '')
      setPhone(auth.user_info.phone || '')
      setEmail(auth._session?.user?.email || '')
    }
  }, [auth])


  const handleSubmit = async (e) => {
    e.preventDefault()

    const userData = {
      name,
      last_name: lastName,
      identification,
      phone,
      email: auth?._session?.user?.email,
      code: auth?.user_info?.code
    }

    console.log('User data to submit:', userData)

    const updateUser = async () => {
      console.log(name, lastName, identification, phone)
      if (!name || !lastName || !identification || !phone) {
        throw new Error('Por favor completa todos los campos')
      }

      if (identification && isNaN(identification)) throw new Error('Ingresa una identificación válida')

      const { error: userError } = await supabase.from('user').update({
        name: userData.name,
        last_name: userData.last_name,
        identification: userData.identification,
      }).eq('code', userData.code)

      const { error: guestError } = await supabase.from('guest').update({
        phone: phone
      }).eq('code_guest', userData.code)

      if (userError || guestError) throw new Error('Algo salió mal al actualizar los datos')

      return 'Datos actualizados correctamente'
    }

    toast.promise(updateUser(), {
      loading: 'Actualizando datos...',
      success: (msg) => {
        setAuth((prev) => ({
          ...prev,
          user_info: {
            ...prev.user_info,
            name: userData.name,
            last_name: userData.last_name,
            identification: userData.identification,
            phone: userData.phone
          }
        }))
        navigate('/')
        return msg
      },
      error: (err) => {
        console.error(err)
        return err.message
      }
    })
  }

  return (
    <>
      <div className="'flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
        <NavBar />
        <main className='profile'>
          <h1>Registro de cliente</h1>
          <form onSubmit={handleSubmit}>
            <section className='pf-input-section'>
              <article>
                <label htmlFor="">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </article>
              <article>
                <label htmlFor="">Apellido</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </article>
              <article>
                <label htmlFor="">Identificación</label>
                <input type="text" inputMode="numeric" value={identification} onChange={(e) => setIdentification(e.target.value)} />
              </article>
              <article>
                <label htmlFor="">Teléfono de contacto</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </article>
              <article>
                <label htmlFor="">Correo electrónico</label>
                <input type="email" value={email} disabled className='pf-input-disabled' />
              </article>
            </section>
            <button>Envíar</button>
          </form>
        </main>
      </div>
      <footer className='profile-footer'>
        <section>
          <img src="public\los_laureles_brand-02.png" alt="" width={150} />
          <ul>
            <li><strong>Contacto</strong></li>
            <li>Puerto colombia</li>
            <li>info@hotellaureles.com</li>
            <li>+57 (301) 435 1292</li>
          </ul>
          <ul>
            <li><strong>Horario de atención</strong></li>
            <li>Recepción: 24 Horas</li>
            <li>Check-In: 3:00 PM</li>
            <li>Check-Out: 12:00 PM</li>
          </ul>
          <ul>
            <li><strong>Los Laureles Newsletter</strong></li>
            <li>Suscríbete para recibir ofertas exclusivas y noticias.</li>
            <li><input type="text" placeholder='Email address' /> <button>Suscribete</button></li>
          </ul>
        </section>
        <p>Consulta nuestros terminos y condiciones</p>
        <p>© 2025 Hotel Resort Los Laureles. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}