import { NavBar } from "../atoms/NavBar";
import { Carrousel } from "../molecules/Carrousel";

export const Header = () => {
    return (
        <header className="flex flex-col items-center justify-start w-full">
            <Carrousel />
        </header>
    );
}