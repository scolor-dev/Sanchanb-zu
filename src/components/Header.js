import { NavLink } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1 className="logo">MyApp</h1>

      <nav>
        <NavLink to="/" className="nav" end>
          Home
        </NavLink>

        <NavLink to="/about" className="nav">
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
