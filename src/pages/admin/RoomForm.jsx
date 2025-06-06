import { useState, useEffect, useContext } from "react";
import { NavBar } from "../../components/atoms/NavBar";
import '../../styles/room_manager.css';
import { UpdateType } from "../../components/organisms/admin_tab_content/UpdateType";
import { DeleteType } from "../../components/organisms/admin_tab_content/DeleteType";
import { CreateType } from "../../components/organisms/admin_tab_content/CreateType";
import { AddRoom } from "../../components/organisms/admin_tab_content/AddRoom";
import { DeleteRoom } from "../../components/organisms/admin_tab_content/DeleteRoom";
import supabase from "../../utils/supabase";
import { toast } from "sonner";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function RoomForm() {
  const { auth } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('Actualizar tipo');
  const [types, setTypes] = useState([]);

  const navigate = useNavigate()

  const tabs = [
    'Actualizar tipo',
    'Eliminar tipo',
    'Crear tipo',
    'Agregar habitación',
    'Eliminar habitación'
  ];

  useEffect(() => {
    if (auth.user_info.role === 'client') {
      navigate('/404')
      return
    }

    const fetchTypes = async () => {
      const tr_res = await supabase.from('type_room').select('*');
      if (tr_res.error) {
        toast.error('Error al cargar los tipos');
        return;
      }

      const dr_res = await supabase.from('detail_room').select('*');
      if (dr_res.error) {
        toast.error('Error al cargar los detalles');
        return;
      }

      const joined = tr_res.data.map(type => {
        const detail = dr_res.data.find(d => d.id === type.id_detail);
        return {
          ...type,
          size: detail?.size || '',
          bathrooms: detail?.number_bathrooms || '',
          bedrooms: detail?.number_rooms || '',
          beds: detail?.number_beds || ''
        };
      });
      setTypes(joined);
    };

    toast.promise(fetchTypes(), {
      loading: 'Cargando...',
      success: 'Conectado a la base de datos',
      error: 'Error al cargar los datos'
    });

  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
      <NavBar />
      <h1 className="text-4xl">Gestión de Habitaciones</h1>
      <section className="tabs-container">
        {tabs.map((tab) => (
          <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </section>
      <main className="tab-content">
        {activeTab === 'Actualizar tipo' && <UpdateType types={types} setTypes={setTypes} />}
        {activeTab === 'Eliminar tipo' && <DeleteType types={types} setTypes={setTypes} />}
        {activeTab === 'Crear tipo' && <CreateType setTypes={setTypes} />}
        {activeTab === 'Agregar habitación' && <AddRoom types={types} />}
        {activeTab === 'Eliminar habitación' && <DeleteRoom />}
      </main>
    </div>
  );
}