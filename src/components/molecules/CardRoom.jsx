export const CardRoom = ({ type, price, capacity, image }) => {
    return (
        <container className={`relative w-full h-[300px] rounded-lg shadow-lg`}>
            <img src={image} alt="" className="absolute w-full h-full z-0 rounded-lg"/>
            
            <div className='flex items-end justify-center w-full h-full z-10'>
                <button className='flex flex-col items-start justify-center w-full h-[100px] p-2 bg-white/95 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer z-10'>
                    <h3>
                        <span className="text-[14px] font-bold text-gray-800"> {type} </span>
                        <br/>
                        <span className="text-[18px] text-[#BF5A30] font-bold">${price}</span>
                        <span className='text-[12px] text-gray-300'>/ noche</span>
                    </h3>
                    <p className='flex justify-between text-[12px] text-gray-600 mt-2'>
                        <i className='pi pi-users'></i>
                        {capacity} personas
                    </p>
                </button>
            </div>
        </container>
    )
}