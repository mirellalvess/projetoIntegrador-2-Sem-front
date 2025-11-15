import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    // Removido apenas "container" para o fundo ocupar toda a largura
    <header className="headerContainer" role="banner">
      <div className="header-center">
        <h1 className="site-title">Portal de Transparência Pública</h1>
      </div>
    </header>
  );
}
