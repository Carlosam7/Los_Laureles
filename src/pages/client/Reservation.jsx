import { NavBar } from "../../components/atoms/NavBar";
import { CardPanelReserve } from "../../components/molecules/CardPanelReserve";
import { CardReserveIncrement } from "../../components/molecules/CardReserveIncrement";
import { CardRoom } from "../../components/molecules/CardRoom";
import { Carrousel } from "../../components/molecules/Carrousel";
import { RoomListAvailability } from "../../components/molecules/RoomListAvailability";
import { SearchBarComplete } from "../../components/molecules/SearchBarComplete";
import { Header } from "../../components/organisms/Header";

import { showRooms } from "../../controllers/Client";
import { useEffect, useState } from "react";

export const Reservation = () => {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await showRooms();
                setRooms(data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    if (rooms.length > 0) {
        console.log("Rooms in Body component:", rooms[0].images[0]);
    }



    return (
        <>
            <NavBar />

            <div className="items-center justify-center">
                <SearchBarComplete rooms={rooms} />
            </div>


        </>

    );
}





