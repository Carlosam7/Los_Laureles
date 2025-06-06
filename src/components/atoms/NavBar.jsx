import 'primeicons/primeicons.css';
import { DropDown } from './DropDown';

export const NavBar = () => {

    return (
        <nav className="flex items-center justify-between w-full h-full">
            <div className="text-xl font-bold text-blue-600">Aquí va el logo</div>
            <ul className="flex space-x-2">
                <li>
                    <button className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] p-2 rounded-full cursor-pointer transition-all duration-500">
                        <span className="pi pi-home text-black" style={{ fontSize: '1.2rem' }}></span>
                    </button>
                </li>
                <li>
                    <DropDown />
                </li>
            </ul>
        </nav>
    )
}