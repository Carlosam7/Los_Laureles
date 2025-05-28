import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import { useState } from 'react';

function App() {
  const [date, setData] = useState(null);
  const [value, setValue] = useState(1);
  const options = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
  ];


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Button label="Los Laureles" icon="pi pi-thumbs-up" className="p-button-rounded p-button-warning" />
    </div>
    </>
  )
}

export default App