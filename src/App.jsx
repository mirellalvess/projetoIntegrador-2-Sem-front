import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import ConsultaDespesas from "./pages/consultaDespesas";
import ConsultaEmpenhos from "./pages/consultaEmpenhos";
import Header from "./components/header";
import BarraNavegacao from "./components/barraNavegacao";
import Footer from "./components/footer";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import { applyAccessibilityPreferences } from "./utils/acessibilidade";
import "./styles/style.css";

function App() {
  useEffect(() => {
    applyAccessibilityPreferences();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container min-h-screen flex flex-col">
          <Header />
          <BarraNavegacao />
          <main className="flex-1 content" id="main-content" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/consulta-despesas" element={<ConsultaDespesas />} />
              <Route path="/consulta-empenhos" element={<ConsultaEmpenhos />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
