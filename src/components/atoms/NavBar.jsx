import 'primeicons/primeicons.css';
import { DropDown } from './DropDown';

import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate()

    const home = () => {
        auth.user_info.role === 'admin' ? navigate('/admin') : navigate('/')
    }
    return (
        <>
            <nav className="flex items-center justify-between w-full h-full">
                <img className="h-[30px] text-xl font-bold" src='https://faowaewkokjiovwtbrbn.supabase.co/storage/v1/object/public/utils//los_laureles_brand-03.png' />
                <ul className="flex space-x-2">
                    <li>
                        <button className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] p-2 rounded-full cursor-pointer transition-all duration-500" onClick={home}>
                            <span className="pi pi-home text-black" style={{ fontSize: '1.2rem' }}></span>
                        </button>
                    </li>
                    <li>
                        <DropDown />
                    </li>
                </ul>
            </nav>
        </>
    )
}