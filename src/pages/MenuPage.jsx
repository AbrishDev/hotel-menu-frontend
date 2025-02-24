import { useEffect, useState } from "react";
import "../styles/menu.css"; // Import updated CSS file

const MenuPage = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/menu") // Backend API
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch menu");
                }
                return response.json();
            })
            .then(data => {
                setMenu(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading menu...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="menu-container">
            <h1 className="hotel-name">🍽 Welcome to Naky Hotel 🍽</h1> {/* Improved visibility */}
            <ul className="menu-list">
                {menu.map((item, index) => (
                    <li key={index} className="menu-item">
                        <span className="menu-item-name">{item.name}</span>
                        <span className="menu-item-price">{item.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuPage;
