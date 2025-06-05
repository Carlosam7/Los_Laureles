import { Image } from 'primereact/image';

export const Gallery = () => {
    return(
        <main className='flex flex-col items-center justify-start w-full h-full bg-white rounded-2xl space-y-4'>
            <section className="grid grid-cols-2 gap-2 items-center justify-center h-[600px] w-full rounded-2xl lg:hidden">
                
                <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                
            </section>

            <section className="hidden lg:flex flex-row items-center justify-center h-[600px] w-full rounded-2xl space-x-2">
                <div className="flex w-1/2 h-full">
                    <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                </div>
                

                <div className="flex w-1/2 h-full space-x-2">
                <div className='flex flex-col w-1/2 h-full space-y-2'>
                    <div className='w-full h-1/2 bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                    <div className='w-full h-1/2 bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                </div>
                <div className='flex flex-col w-1/2 h-full'>
                    <div className='w-full h-full bg-[url("https://imagenes.20minutos.es/uploads/imagenes/2024/05/15/una-imagen-creada-por-la-herramienta-imagen-3-de-google-1.jpeg")] bg-cover bg-center rounded-2xl'/>
                </div>
                    

                </div>


            </section>
        </main>
    )
}       