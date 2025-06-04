import '../../styles/profile_form.css'
import 'primeicons/primeicons.css'
import supabase from '../../utils/supabase'

export function Profile () {

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  
  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className='profile'>
      <header>
        <nav>
          <ul>
            <li><i className='pi pi-home' style={{fontSize: '2rem'}}></i></li>
            <li onClick={() => logout()}><i className='pi pi-user' style={{fontSize: '2rem'}}></i></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>Registro de cliente</h1>
        <form onSubmit={handleSubmit}>
          <section className='pf-input-section'>
            <article>  
              <label htmlFor="">Nombre</label>
              <input type="text" />
            </article>
            <article>  
              <label htmlFor="">Apellido</label>
              <input type="text" />
            </article>
            <article>  
              <label htmlFor="">Identificación</label>
              <input type="text" />
            </article>
            <article>  
              <label htmlFor="">Teléfono de contacto</label>
              <input type="text" />
            </article>
            <article>  
              <label htmlFor="">Correo electrónico</label>
              <input type="text" />
            </article>
          </section>
          <button>Enviar</button>
        </form>
      </main>
      <footer>
        <section>
          <img src="public\los_laureles_brand-02.png" alt="" width={250}/>
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
            <li><input type="text" placeholder='Email address'/> <button>Suscribete</button></li>
          </ul>
        </section>
          <p>Consulta nuestros terminos y condiciones</p>
          <p>© 2025 Hotel Resort Los Laureles. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}