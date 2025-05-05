    import React from "react";
    import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";


    import Login from "./view/Login";
    import Register from "./view/Registrar";
    import Home from "./view/Home";
    import Principal from "./view/Principal";
    import MuseoDetalle from "./view/MuseoDetalle";
    import RegistrarMuseoAdminView from "./view/admin/RegistrarMuseoAdminView";


    // Componentes
    import Navbar from "./components/Navbar";

    function App() {
    const MainApp = () => {
        const location = useLocation();

        const hideNavbarRoutes = ["/", "/register"];
        const showNavbar = !hideNavbarRoutes.includes(location.pathname);

        return (
        <>
            {showNavbar && <Navbar />}
            <div className="pages">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inicio" element={<Home />} />
                <Route path="/departamento/:departamentoId" element={<Principal />} />
                <Route path="/museo/:id" element={<MuseoDetalle />} />
                <Route path="/crear-solicitud" element={<RegistrarMuseoAdminView />} />
            </Routes>
            </div>
        </>
        );
    };

    return (
        <div className="App">
        <BrowserRouter>
            <MainApp />
        </BrowserRouter>
        </div>
    );
    }

    export default App;
