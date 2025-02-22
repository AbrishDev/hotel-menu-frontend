import { useEffect, useState } from "react";

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
        <div style={{ textAlign: "center" }}>
            <h2>Menu</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {menu.map((item, index) => (
                    <li key={index} style={{ marginBottom: "10px", fontSize: "18px" }}>
                        <strong>{item.name}</strong> - ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuPage;
