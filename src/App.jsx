import { Button } from 'primereact/button';
//import { Calendar } from 'primereact/calendar';

import { useState } from 'react';
import supabase from './utils/supabase';

function App() {
  const [color, setColor] = useState('warning');
  const listColors = ['warning', 'success', 'info', 'secondary', 'primary'];

  const changeColor = () => {
    setColor((prevColor) => {
      const currentIndex = listColors.indexOf(prevColor);
      const nextIndex = (currentIndex + 1);
      if (nextIndex >= listColors.length) {
        return listColors[0];
      }
      return listColors[nextIndex];
    }
  );
  }

  const response = async () => {
    const { data } = (await supabase.from('room').select());

    //Obtener los datos de la respuesta
    if (data.error) {
      console.error('Error fetching data:', data.error);
      return [];
    }

    const rooms = data.map((room) => ({
      id_room: room.id_room,
      id_type: room.id_type,
      capacity: room.capacity,
      description: room.description,
    }))

    return rooms;
  }
  const data = response();

  console.log(data);
  


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Button onClick={() => {changeColor()}} label="Los Laureles" icon="pi pi-thumbs-up" className={`p-button-rounded p-button-${color}`} />
    </div>
    </>
  )
}

export default App