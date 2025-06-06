import { NavBar } from "../../components/atoms/NavBar";
import { Body } from "../../components/organisms/Body";
import { Header } from "../../components/organisms/Header";
import { PageRoom } from "./PageRoom";

export const Home = () => {
    return (
        //space-y-24
        <main className="flex flex-col items-center justify-start w-full min-h-screen bg-white p-5 md:p-10 min-w-[450px] space-y-5">
            <NavBar />
            <Header />
            <Body />
        </main>
    );
}
