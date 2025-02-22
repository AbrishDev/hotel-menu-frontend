import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MenuPage from "./pages/MenuPage";

function App() {
    return (
        <Router>
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h1>Hotel Menu System</h1>
                <nav>
                    <Link to="/menu" style={{ marginRight: "10px" }}>View Menu</Link>
                </nav>

                <Routes>
                    <Route path="/menu" element={<MenuPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
