import { useEffect, useState } from 'react';
import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { availability, createReserve } from '../../controllers/Client';


export const CardPanelReserve = ({ idType, type, startDate, endDate, price }) => {
    const { auth } = useContext(AuthContext);
    const user = auth?.user;
    const [startD, setStartD] = useState(startDate);
    const [endD, setEndD] = useState(endDate);
    const [days, setDays] = useState(0);
    const [availables, setAvailables] = useState([]);
    const [quantity, setQuantity] = useState(1);

    //console.log(type<)

    const updateQuantity = (change) => {
        setQuantity(prev => Math.max(0, prev + change));
    };

    const parsearDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
    }
    useEffect(() => {
        const updateData = async () => {
            if (startD && endD) {
            const days = (endD - startD) / (1000 * 60 * 60 * 24)
            setDays(days);
            await getRoomsAvailable();
         };
        }
        updateData();
    }, [startD, endD])

    const getRoomsAvailable = async () => {
        try {
            const a = await availability(type, parsearDate(startD), parsearDate(endD));
            console.log('Habitaciones disponibles:', a.idRooms);
            setAvailables(a.idRooms || []);
        } catch (err) {
            console.error('Error obteniendo habitaciones disponibles', err);
            setAvailables([]);
        }
    };

    console.log('fdfd', user.id)

    // console.log(quantity)

    // console.log('Slice', availables.slice(0, quantity))

    return(
        <main className='w-[350px] h-[450px] md:w-[450px] md:h-[500px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl bg-white flex items-center justify-center'>
            <section className='flex flex-col items-start w-full h-full p-10 bg-white rounded-2xl space-y-10'>
                <div className='flex items-center justify-between w-full'>
                    <h2 className='flex items-center text-[32px] font-bold space-x-2'>
                        <p>${price} </p>
                        <p className='text-[20px] font-light text-gray-400'>
                            /dia
                        </p>
                    </h2>
                </div>
                <section className='flex flex-col items-center justify-between w-full h-full'>
                    <section className="card grid grid-cols-2 w-full justify-evenly gap-4">
                        <FloatLabel className='w-full h-[60px]'>

                            <Calendar inputId="startDay" 
                                value={startD} 
                                onChange={(e) => 
                                    {setStartD(e.value);
                                    getRoomsAvailable()}
                                }
                                
                                className='w-full h-full' />
                            <label htmlFor="startDay">Fecha de inicio</label>
                        </FloatLabel>

                        <FloatLabel className='w-full h-[60px]'>
                            <Calendar inputId="endDay" 
                                value={endD} 
                                onChange={(e) => 
                                    {setEndD(e.value); 
                                    getRoomsAvailable()}
                                } 
                                className='w-full h-full' />
                            <label htmlFor="endDay">Fecha fin</label>
                        </FloatLabel>

                        <div className='relative flex items-center justify-between h-[60px] col-span-2 rounded-lg px-5 border-[1px] border-gray-300'>
                            <span className='flex w-[50%] left-0 text-[14px] font-light text-gray-400'>
                                Total
                            </span>
                            <span className='flex justify-end w-[50%] right-0 text-[20px] font-medium text-gray-700'>
                                $ {(days < 0) ? 'NaN' : days * price * quantity}
                            </span>
                        </div>
                        {/* Controles de cantidad */}
                        <div className="flex col-span-2 justify-end items-center rounded-lg">

                            <button
                                className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={() => updateQuantity(-1)}
                                disabled={quantity === 0}
                            >
                                {/* Icono menos usando SVG */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                </svg>
                            </button>

                            <span className="text-xl font-semibold w-12 text-center">
                                {quantity}
                            </span>

                            <button
                                className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => updateQuantity(1)}
                                disabled = { quantity === availables.length}
                            >
                                {/* Icono más usando SVG */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14" />
                                    <path d="M5 12h14" />
                                </svg>
                            </button>
                        </div>
                        {/* Controles de cantidad */}
                        <div className="flex col-span-2 justify-end items-center rounded-lg">

                            <button
                                className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                onClick={() => updateQuantity(-1)}
                                disabled={quantity === 0}
                            >
                                {/* Icono menos usando SVG */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                </svg>
                            </button>

                            <span className="text-xl font-semibold w-12 text-center">
                                {quantity}
                            </span>

                            <button
                                className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                onClick={() => updateQuantity(1)}
                                // disabled={quantity === availability} // Aquí puedes definir una variable o prop para la cantidad máxima disponible
                            >
                                {/* Icono más usando SVG */}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14" />
                                    <path d="M5 12h14" />
                                </svg>
                            </button>
                        </div>
                    
                    </section>

                    <button onClick={() => {
                        if (startD > endD){
                            console.log('NOOOOOO')
                        }else{
                            console.log('Reservando...')
                            createReserve(user.id, startD, endD, availables.slice(0, quantity))
                            console.log('Completado')
                        }
                    }
                    } 
                    className='w-full h-[60px] bg-amber-400 rounded-lg text-black font-bold hover:bg-amber-500 transition-all duration-300 cursor-pointer'>
                        Reservar
                    </button>

                    <section className='flex flex-col items-center justify-end w-full h-[60px] border-t-[1px] border-gray-300 pt-4'>
                        <span className='text-[12px]'>
                            Terminos del propietario
                        </span>
                        <span className='text-[12px] text-[#BF5A30]'>
                            Ver términos y condiciones del propietario aquí
                        </span>
                    </section>
                </section>
            </section>
        </main>
    );
}