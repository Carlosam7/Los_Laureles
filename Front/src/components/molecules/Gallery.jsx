import { Image } from 'primereact/image';

export const Gallery = ({ images }) => {
    console.log(images)
    return(
        <main className='flex flex-col items-center justify-start w-full h-full bg-white rounded-2xl space-y-4'>
            <section className="grid grid-cols-2 gap-2 items-center justify-center h-[600px] w-full rounded-2xl lg:hidden">
                
                <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[0].Url })` }}/>
                <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[1].Url })` }}/>
                <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[2].Url })` }}/>
                <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[3].Url })` }}/>
                
            </section>

            <section className="hidden lg:flex flex-row items-center justify-center h-[600px] w-full rounded-2xl space-x-2">
                <div className="flex w-1/2 h-full">
                    <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[0].Url })` }}/>
                </div>
                

                <div className="flex w-1/2 h-full space-x-2">
                <div className='flex flex-col w-1/2 h-full space-y-2'>
                    <div className='w-full h-1/2 bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[1].Url })` }}/>
                    <div className='w-full h-1/2 bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[2].Url })` }}/>
                </div>
                <div className='flex flex-col w-1/2 h-full'>
                    <div className='w-full h-full bg-cover bg-center rounded-2xl' style={{ backgroundImage: `url(${images[3].Url })` }}/>
                </div>
                    

                </div>


            </section>
        </main>
    )
}       