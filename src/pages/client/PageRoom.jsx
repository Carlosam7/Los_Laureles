import 'primeicons/primeicons.css';
import { Gallery } from '../../components/molecules/Gallery';
import { CardPanelReserve } from '../../components/molecules/CardPanelReserve';

export const PageRoom = ({ start_date, end_date, price }) => {
    return (
        <main className="flex flex-col items-center justify-start w-full bg-white min-w-[450px] p-5 md:p-0">
            <section className="flex flex-col items-start w-full">
                <h1 className="text-2xl font-bold mb-2">Habitación Presidencial Elegante</h1>
                <div className="flex items-start w-full h-full md:space-x-4 md:space-y-0">
                    <ul className="grid grid-cols-3 md:grid-cols-5 items-start text-[12px] gap-2 text-gray-700">
                        <li className='flex'>
                            <i className="pi pi-map-marker"/>
                            <h4>Puerto Colombia</h4>
                        </li>
                        <li>
                            <h4>3 camas</h4>
                        </li>
                        <li>
                            <h4>2 baños</h4>
                        </li>
                        <li>
                            <h4>3 habitaciones</h4>
                        </li>
                        <li className='flex'>
                            <i className="pi pi-star-fill"/>
                            <h4>4.5</h4>
                        </li>
                    </ul>
                </div>
            </section>

            <section className='flex w-full h-[600px] bg-amber-300 rounded-2xl mt-4'>
                <Gallery />
            </section>

            <section className='flex flex-col justify-center items-center w-full mt-20 space-y-10 lg:flex-row lg:justify-evenly lg:items-start lg:space-y-0'>
                <article className='flex flex-col items-center lg:items-start w-[50%] min-w-[350px]'>
                    <h2 className='text-[25px] font-bold'>Habitación presidencial elegante</h2>
                    <section className="flex items-start">                
                        <ul className="flex text-[12px] space-x-4 text-gray-700">
                            <li className='flex'>
                                <h4>3 huespedes</h4>
                            </li>
                            <li>
                                <h4>Wifi</h4>
                            </li>
                            <li>
                                <h4>Aire acondicionado</h4>
                            </li>
                        </ul>
                    </section>
                    <section className='flex flex-col items-start justify-start w-full mt-4 space-y-10'>
                        <div className='flex items-start justify-start mt-4 space-y-2'>
                            <div className='flex items-center justify-between space-x-4'>
                                <i className='flex items-center justify-center p-4 pi pi-home w-[50px] h-[50px] bg-amber-200 rounded-full'/>
                                <h2 className='text-[20px] font-medium space-x-2'>
                                    Everything you need in one room
                                    <p className='text-[14px] font-light'>Everything you need in one room</p>
                                </h2>
                            </div>
                        </div>

                        <div className='flex items-center justify-between space-x-4'>
                            <i className='flex items-center justify-center p-4 pi pi-home w-[50px] h-[50px] bg-amber-200 rounded-full'/>
                            <h2 className='text-[20px] font-medium space-x-2'>
                                Everything you need in one room
                                <p className='text-[14px] font-light'>Everything you need in one room</p>

                            </h2>     
                        </div>
                        
                        <div className='flex items-center justify-between space-x-4'>
                            <i className='flex items-center justify-center p-4 pi pi-home w-[50px] h-[50px] bg-amber-200 rounded-full'/>
                            <h2 className='text-[20px] font-medium space-x-2'>
                                Everything you need in one room
                                <p className='text-[14px] font-light'>Everything you need in one room</p>

                            </h2>     
                        </div>
                        <div className='flex items-center justify-between space-x-4'>
                            <i className='flex items-center justify-center p-4 pi pi-home w-[50px] h-[50px] bg-amber-200 rounded-full'/>
                            <h2 className='text-[20px] font-medium space-x-2'>
                                Everything you need in one room
                                <p className='text-[14px] font-light'>Everything you need in one room</p>

                            </h2>     
                        </div>
                    </section>
                </article>
            
                <CardPanelReserve endDate={new Date} startDate={new Date} price={245000}/>

            </section>
        </main>
    )
}