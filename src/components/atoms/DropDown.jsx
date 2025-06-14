import { useContext, useState } from "react";
import supabase from "../../utils/supabase";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext";


export const DropDown = () => {
    const { auth } = useContext(AuthContext)
    const [isOpen, setItsOpen] = useState(false);
    const toggleDropdown = () => {
        setItsOpen(!isOpen);
    };

    const navigate = useNavigate()

    const signout = () => {
        const signOutPromise = async () => {
            const { error } = await supabase.auth.signOut()

            if (error) throw new Error('Erroral cerrar sesión')
        }

        toast.promise(signOutPromise(), {
            loading: 'Cerrando sesión...',
            success: () => {
                localStorage.removeItem("sb-auth-token");
                sessionStorage.removeItem("sb-auth-token");
                return '¡Regresa pronto!'
            },
            error: (err) => err.message
        })
    }

    const reserveManager = () => {
        auth.user_info.role === 'admin' ? navigate('/admin/rsm') : navigate('/myreserves')
    }

    return (

        <main className="relative flex items-center justify-center w-full h-full">
            <button onClick={() => { toggleDropdown() }} className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] p-2 bg-[#FFF6DD] rounded-full hover:bg-[#FDC800] cursor-pointer transition-all duration-500">
                <span className="pi pi-user text-black" style={{ fontSize: '1.2rem' }}></span>
            </button>

            <menu className={`${isOpen ? '' : 'hidden'} absolute transition-all duration-700 top-15 right-0 min-w-[180px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg`}>
                <ul
                    className="flex flex-col items-start justify-start w-full h-full p-2">
                    <li
                        className="cursor-pointer text-slate-800 flex w-full h-[40px] text-sm items-center rounded-md p-3 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        onClick={() => { navigate('/profile') }}
                    >
                        <p className="text-slate-800 font-medium ml-2">
                            Mi perfil
                        </p>
                    </li>
                    <li
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        onClick={reserveManager}
                    >
                        <p className="text-slate-800 font-medium ml-2">
                            Reservas
                        </p>
                    </li>
                    <li
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                    >
                        <p className="text-slate-800 font-medium ml-2">
                            Mis favoritos
                        </p>
                    </li>
                    <hr className="my-2 border-slate-200" role="menuitem" />
                    <li
                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        onClick={() => signout()}
                    >
                        <p className="text-slate-800 font-medium ml-2">
                            Cerrar sesión
                        </p>
                    </li>
                </ul>
            </menu>
        </main>
    )
}