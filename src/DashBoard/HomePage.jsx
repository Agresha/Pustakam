import MostDownloadedBooks from "../home-components/MostdownloadedBooks.jsx";
import LatestBooks from "../home-components/LatestBooks.jsx";
import Search from "../home-components/Search.jsx";
import Footer from '../home-components/Footer.jsx'
import Advertisment from "../home-components/Advertiement.jsx";
import FreeBooks from "../home-components/FreeBooks.jsx";


function HomePage() {
    return (<>
    <Search />
    <Advertisment />
    <MostDownloadedBooks />
    <LatestBooks />
    <FreeBooks />
    <Footer />
    </>);
}

export default HomePage;