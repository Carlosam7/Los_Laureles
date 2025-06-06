import { useState } from 'react';
import '../../styles/login.css'
import supabase from '../../utils/supabase';
import { toast } from 'sonner';

export const Login = () => {
    const [activeButton, setActiveButton] = useState('signIn');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleButtonClick = (buttonType) => {
        if (buttonType === 'signIn') {
            setActiveButton('signIn');
        } else {
            setActiveButton('signUp');
        }
        console.log(`Botón ${activeButton} presionado`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()


        const signPromise = async () => {
            if (!email || !password) throw new Error('Todos los campos son requeridos')
            if (!email.includes('@') || !email.includes('.')) throw new Error('Introduce un email válido')
            if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres')

            if (activeButton === 'signIn') {
                let { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) throw new Error('Email o contraseña inválidos')

                console.log(data)
            } else {
                let { data, error } = await supabase.auth.signUp({
                    email,
                    password
                })
                if (error) throw new Error(error)
                else if (data.user.identities.length === 0) {

                    throw new Error('Parece que ya existe una cuenta con este email. Si eres tú, trata de iniciar sesión')

                }
                console.log(data)
            }

            setEmail('')
            setPassword('')

        }

        toast.promise(signPromise(), {
            loading: 'Iniciando sesión...',
            success: '¡Bienvenido!',
            error: (err) => { console.error(err); return err.message }
        })

    }

    return (
        <main className='login-bg'>

            <form onSubmit={handleSubmit} noValidate className='login-form'>

                <header className='flex flex-col items-center'>
                    <img src="https://faowaewkokjiovwtbrbn.supabase.co/storage/v1/object/public/utils//los_laureles_brand-21.png" alt="" width={180} />
                    <h2 className='text-2xl font-bold text-gray-800 text-centermt-5 mt-5'>¡Bienvenido!</h2>
                    <p className='text-gray-600 text-[12px] text-center'>¡Hola! Por favor, ingresa tus datos</p>
                </header>
                <section className='buttonContainer'>
                    <section className='btn-section'>
                        <button
                            onClick={() => handleButtonClick('signIn')}
                            className={`flex items-center justify-center text-center w-[50%] h-full text-black text-[14px] z-30`} type='button'>
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => handleButtonClick('signUp')}
                            className={`flex items-center justify-center text-center w-[50%] h-full text-black text-[14px] z-30`} type='button'>
                            Registrarse
                        </button>
                        <div className={`absolute bg-white w-[48.5%] h-[52px] rounded-xl transition-all duration-500 ${activeButton === 'signUp' ? 'translate-x-full' : ''}`} >
                        </div>
                    </section>
                </section>
                <main>
                    <input type="email" placeholder='nombre@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder='contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button>Iniciar sesión</button>
                </main>
                <footer>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </footer>
            </form>
        </main>
    );

}