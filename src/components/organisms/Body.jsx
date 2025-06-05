import { useEffect, useState } from "react";

import { CardRoom } from "../molecules/CardRoom"
import { showRooms } from "../../controllers/Client";

export const Body = () => {

    const [rooms, setRooms] = useState([]);


    // console.log(handleGetTypesRooms())
    // showRooms(roomsData)
    // setRooms(roomsData)

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await showRooms();
                setRooms(data);
                //console.log("Rooms fetched successfully:", data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);


    return (
        <main className="flex flex-col items-center justify-start w-ful space-y-20">

            <section className="grid grid-cols-1 lg:flex flex-row-reverse items-center justify-between w-full max-w-[1000px] space-y-10 lg:space-y-0">
                <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-[40%] lg:h-[550px] p-4 lg:m-5">
                    <h1 className="text-center lg:text-left text-[24px] md:text-[50px] font-bold text-gray-800">
                        Descubre la frescura y el lujo en cada rincón
                    </h1>
                    <p className="text-[14px] text-center lg:text-left text-gray-600 mt-4">
                        Nuestro hotel, situado en la ciudad de Puerto Colombia el corazón del paraíso,
                        ofrece una experiencia inolvidable con servicios de primera clase y una ubicación
                        privilegiada con las mejores vistas.
                    </p>
                </div>
                <div className="flex items-center justify-center w-full lg:w-[60%] h-[550px] p-4 bg-[#FDC800] rounded-lg shadow-md">
                    <h1>AQUÍ VA UNA IMAGEN</h1>
                </div>

            </section>

            <section className="flex flex-col items-center justify-evenly w-full bg-[#FFF6DD] rounded-lg py-20 md:p-20">
                <h1>
                    <span className="text-[50px] font-bold text-gray-800">Servicios</span>
                </h1>
                <div className="grid grid-cols-2 space-x-0 lg:grid-cols-4 ">
                    <div className="flex flex-col items-start justify-evenly w-full h-[350px] p-4 rounded-lg space-y-2">
                        <section className="flex flex-col items-start justify-evenly w-full h-[50%]">
                            <i className="pi pi-wifi text-gray-800 bg-[#FFF6DD] p-4 rounded-2xl" style={{ fontSize: '2rem' }}></i>
                            <h2 className="text-[24px] font-bold text-gray-800">Wi-fi gratis</h2>
                        </section>

                        <p className="text-[14px] text-gray-600 mt-2 h-[50%]">
                            Covertura en zona de Hotel y playa. Disfruta de conexión a internet de alta velocidad en todas las áreas del hotel y la playa.
                        </p>
                    </div>
                    <div className="flex flex-col items-start justify-evenly w-full h-[350px] p-4 rounded-lg space-y-2">
                        <section className="flex flex-col items-start justify-evenly w-full h-[50%]">
                            <i className="pi pi-heart text-gray-800 bg-[#FFF6DD] p-4 rounded-2xl" style={{ fontSize: '2rem' }}></i>
                            <h2 className="text-[24px] font-bold text-gray-800">Gimnasio</h2>
                        </section>
                        <p className="text-[14px] text-gray-600 mt-2 h-[50%]">
                            Mantente en forma durante tu estancia con nuestro gimnasio totalmente equipado con máquinas de última generación y un ambiente motivador.
                        </p>
                    </div>
                    <div className="flex flex-col items-start justify-evenly w-full h-[350px] p-4 rounded-lg space-y-2">
                        <section className="flex flex-col items-start justify-evenly w-full h-[50%]">
                            <i className="pi pi-sun text-gray-800 bg-[#FFF6DD] p-4 rounded-2xl" style={{ fontSize: '2rem' }}></i>
                            <h2 className="text-[24px] font-bold text-gray-800">Playa</h2>
                        </section>
                        <p className="text-[14px] text-gray-600 mt-2 h-[50%]">
                            Relájate y rejuvenece en nuestro exclusivo spa con tratamientos únicos.
                        </p>
                    </div>
                    <div className="flex flex-col items-start justify-evenly w-full h-[350px] p-4 rounded-lg space-y-2">
                        <section className="flex flex-col items-start justify-evenly w-full h-[50%]">
                            <i className="text-gray-800 bg-[#FFF6DD] p-4 rounded-2xl" style={{ fontSize: '2rem' }}><img width="35" height="35" src="https://img.icons8.com/external-goofy-solid-kerismaker/96/external-Swim-sport-goofy-solid-kerismaker.png" alt="external-Swim-sport-goofy-solid-kerismaker" /></i>
                            <h2 className="text-[24px] font-bold text-gray-800">Piscinas</h2>
                        </section>
                        <p className="text-[14px] text-gray-600 mt-2 h-[50%]">
                            Relájate y rejuvenece en nuestro exclusivo spa con tratamientos únicos.
                        </p>
                    </div>
                </div>


            </section>

            <section className="flex flex-col items-center justify-evenly w-full rounded-lg py-20 md:p-20">
                <h1 className="text-[50px] font-bold text-gray-800">
                    Habitaciones
                </h1>
                <p className="text-[14px] text-center text-gray-600 mt-2 my-5">
                    Tenemos una habitación para cada tipo de viajero. Ya sea que busques privacidad, lujo o espacio para compartir, en Los Laureles encontrarás el lugar perfecto para ti.
                </p>
                <section className="grid grid-cols-2 lg:grid-cols-3 w-full max-w-[1000px] m-5 gap-5">


                    {rooms.length > 0 ? (
                        rooms.map((room, index) => (
                            <CardRoom
                                key={index}
                                id={room.idRoom}
                                idType={room.idType}
                                type={room.type}
                                price={room.priceDay}
                                capacity={room.capacity}
                                image={room.images[0].Url} // Assuming images is an array of image URLs
                            />
                        )
                        )
                    ) : (
                        <p>Cargando habitaciones</p>
                    )}
                </section>
            </section>
        </main>
    )
}