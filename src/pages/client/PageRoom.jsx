import 'primeicons/primeicons.css';
import { Gallery } from '../../components/molecules/Gallery';
import { CardPanelReserve } from '../../components/molecules/CardPanelReserve';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRoom } from '../../controllers/Client';
import { NavBar } from '../../components/atoms/NavBar';

export const PageRoom = () => {

    const { idType } = useParams();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRoom(idType);
            setRoom(data);
            console.log(room)
        };
        fetchData();
    }, [idType])

    if (!room) return <p>Cargando información...</p>;

    return (
        <main className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
            <NavBar />
            <main className="flex flex-col items-center justify-start w-full bg-white min-w-[450px] p-5 md:p-0">
                <section className="flex flex-col items-start w-full">
                    <h1 className="text-2xl font-bold mb-2">Habitación {room.Type}</h1>
                    <div className="flex items-start w-full h-full md:space-x-4 md:space-y-0">
                        <ul className="grid grid-cols-3 md:grid-cols-5 items-start text-[12px] gap-2 text-gray-700">
                            <li className='flex'>
                                <i className="pi pi-map-marker" />
                                <h4>Puerto Colombia</h4>
                            </li>
                            <li>
                                <h4>Camas: {room.numberBeds}</h4>
                            </li>
                            <li>
                                <h4>Baños: {room.numberBathrooms}</h4>
                            </li>
                            <li>
                                <h4>Habitaciones: {room.numberRooms}</h4>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className='flex w-full h-[600px] bg-amber-300 rounded-2xl mt-4'>
                    <Gallery images={room.images} />
                </section>

                <section className='flex flex-col justify-center items-center w-full mt-20 space-y-10 lg:flex-row lg:justify-evenly lg:items-start lg:space-y-0'>
                    <article className='flex flex-col items-center lg:items-start w-[50%] min-w-[350px]'>
                        <h2 className='text-[25px] font-bold'>Habitación {room.Type}</h2>
                        <section className="flex items-start">
                            <ul className="flex text-[12px] space-x-4 text-gray-700">
                                <li>
                                    <h4>Check in: 7:00AM</h4>
                                </li>
                                <li>
                                    <h4>Check out: 7:00PM</h4>
                                </li>
                            </ul>
                        </section>
                        <section className='flex flex-col items-start justify-start w-full mt-4 space-y-10'>
                            <div className='flex items-start justify-start mt-4 space-y-2'>
                                <div className='flex items-center justify-between space-x-4'>
                                    <i className='flex items-center justify-center text-center p-4 pi pi-home w-[50px] h-[50px] bg-amber-200 rounded-full' />
                                    <h2 className='text-[20px] font-medium space-x-2'>
                                        Everything you need in one room
                                        <p className='text-[14px] font-light'>Everything you need in one room</p>
                                    </h2>
                                </div>
                            </div>

                            <div className='flex items-center justify-between space-x-4'>
                                <i className='flex items-center justify-center text-center p-4 pi pi-wifi w-[50px] h-[50px] bg-amber-200 rounded-full' />
                                <h2 className='text-[20px] font-medium space-x-2'>
                                    WI- FI
                                    <p className='text-[14px] font-light'>Convertura en zona del hotel y playa.</p>

                                </h2>
                            </div>

                            <div className='flex items-center justify-between space-x-4'>
                                <i className='flex items-center text-center justify-center p-4 pi pi-heart w-[50px] h-[50px] bg-amber-200 rounded-full' />
                                <h2 className='text-[20px] font-medium space-x-2'>
                                    Mantente en forma con nuestro gimnasio
                                    <p className='text-[14px] font-light'>Todo lo que necesitas para cuidar de tu salud</p>

                                </h2>
                            </div>
                            <div className='flex items-center justify-between space-x-4'>
                                <i className='flex items-center justify-center text-center p-4 pi pi-asterisk w-[50px] h-[50px] bg-amber-200 rounded-full' />
                                <h2 className='text-[20px] font-medium space-x-2'>
                                    Tu gastronomía favorita a una puerta
                                    <p className='text-[14px] font-light'>Más de 10 restaurantes con las mejores gastronomías del mundo</p>
                                </h2>
                            </div>
                        </section>
                    </article>

                    <CardPanelReserve price={room.priceDay} type={room.Type} />
                </section>
            </main>
        </main>
    )
}