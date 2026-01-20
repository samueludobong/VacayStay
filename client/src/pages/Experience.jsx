import Contact from '../components/experience/Contact'
import Footer from '../components/Footer'
import Work from '../components/experience/Work'
import Services from '../components/experience/Services'
import About from '../components/experience/About'
import Header from '../components/experience/Header'
import Navbar from '../components/Navbar'
import LenisScroll from '../components/experience/LenisScroll'

export default function Experience() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <Header />
            <About />
            <Services />
            <Work />
            <Contact />
            <Footer />
        </>
    )
}
