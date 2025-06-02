import { useState } from 'react';
import { activeButtonStyle, background, button, buttonContainer, buttonGroup, containerLogin, paragraph, sectionWelcome, title } from './stylesCss';

export const Login = () => {
    const [activeButton, setActiveButton] = useState('signIn');

    const handleButtonClick = (buttonType) => {
        if (buttonType === 'signIn') {
            setActiveButton('signIn');
        }else{
            setActiveButton('signUp');
        }
        // Aquí puedes agregar la lógica para manejar el inicio de sesión o registro
        console.log(`Botón ${activeButton} presionado`);

    };

    return (
        <>
            <div className= {`${background}`} >
                <div className= {`${containerLogin}`}>
                    <section className= {`${sectionWelcome}`}>
                        <h1 className="text-[20px] text-black font-black" >
                            Aquí va el logo
                        </h1>
                        {/* <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-4" /> */}
                        <div className="text-center mb-4 space-y-2">
                            <h1 className= {
                                    `${title}`
                                }>
                                ¡Bienvenido!
                            </h1>
                            <p  className= {`
                                    ${paragraph}`}>
                                ¡Hola! Por favor, ingresa tus datos
                            </p>
                        </div>
                        <section className= {`${buttonContainer}`}>
                            <section className= {`${buttonGroup}`}>    
                                    <button 
                                        onClick={() => handleButtonClick('signIn')}
                                        className= {`${button}`} >
                                        Iniciar sesión
                                    </button>
                                    <button 
                                        onClick={() => handleButtonClick('signUp')}
                                        className= {`${button}`} >
                                        Registrarse
                                    </button>
                                
                                <div className = {`
                                    ${activeButtonStyle} 
                                    ${activeButton === 'signUp' ? 'translate-x-full' : '' }`} >
                                </div>
                            </section>
                        </section>
                    </section>
                    <h2 className= {`
                        ${paragraph}`}>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    </h2>
                </div>
            </div>
        </>

    );

}