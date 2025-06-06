import { useState } from "react";
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';

export const Carrousel = () => {
    const [dates, setDates] = useState(null);
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'Estándar Tropical', code: 'ST' },
        { name: 'Presidencial Elegance', code: 'PE' },
        { name: 'Suite Royal Relax', code: 'SR' },
        { name: 'Familiar Natural', code: 'FN' },
        { name: 'King Comfort', code: 'KC' },
        { name: 'Queen Serenity', code: 'QS' }
    ];

    return (
        <section className={`flex items-center justify-start w-full h-[600px] rounded-2xl bg-amber-600`}>
            <div className="flex flex-col items-center justify-evenly w-full h-full bg-black/20 rounded-2xl p-10">
                <div className="flex flex-col items-center justify-center w-full px-5">
                    <h1 className="text-xl md:text-[4rem] text-center font-bold text-white">Bienvenidos al</h1>
                    <h1 className="text-2xl md:text-[4rem] text-center font-bold text-white">Hotel Resort Los Laureles</h1>
                    <p className="mt-4 text-sm text-white text-center">Entra en un mundo de naturaleza, confort y atención personalizada en nuestros espacios</p>
                </div>
                <div className="flex flex-col w-full max-w-[800px] justify-center items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    
                    <Calendar   value={dates} 
                                onChange={(e) => setDates(e.value)} 
                                selectionMode="range" 
                                readOnlyInput 
                                hideOnRangeSelection 
                                className="w-full"
                                placeholder="Elige tus fechas"
                                showIcon
                                
                    />
                   
                    <MultiSelect 
                        value={selectedCities} 
                        onChange={(e) => setSelectedCities(e.value)} 
                        options={cities} 
                        optionLabel="name" 
                        maxSelectedLabels={1} inputId='types' className="w-full"  placeholder="Elige tu tipo"
                    />

                    <button className="flex items-center justify-center md:justify-between w-full px-4 py-3 text-black bg-[#FDC800] rounded-md md:w-[40%]">
                        <span className="font-medium">Buscar</span>
                        <span className={`invisible md:visible pi pi-arrow-right`} style={{fontSize: '1rem'}}></span>
                    </button>

                </div>
            </div>
        </section>
    );
}