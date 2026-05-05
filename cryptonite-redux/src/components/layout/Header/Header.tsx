import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSearchText } from "../../../redux/searchSlice";
import "./Header.css";

function Header() {
    const dispatch = useAppDispatch();
    const searchText = useAppSelector(state => state.search.searchText);

    const location = useLocation();
    const isHomePage = location.pathname === "/" || location.pathname === "/home";

    return (
        <header className="header">
            <h1>Cryptonite</h1>

            <nav>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/reports">Live Reports</NavLink>
                <NavLink to="/ai">AI Recommendation</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>

            <div className="search-area">
                {isHomePage && (
                    <input
                        type="search"
                        placeholder="Search coin..."
                        value={searchText}
                        onChange={e => dispatch(setSearchText(e.target.value))}
                    />
                )}
            </div>
        </header>
    );
}

export default Header;