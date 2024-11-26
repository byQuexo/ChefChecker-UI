import Navbar from "@/app/utils/components/index/Header/Navbar";
import rootStore from "@/app/utils/stores/globalStore";
import FooterComponent from "@/app/utils/components/index/Footer/FooterComponent";

function HomeContent() {
    return (
        <div className={`min-h-screen flex flex-col ${rootStore.darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <Navbar />

        </div>
    );
}

export default HomeContent;