import { useEffect, useState } from "react";
import "../styles/admin.css"; // Create a new CSS file for admin styles
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react"; // Import the QR code library

const AdminDashboard = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
    const navigate = useNavigate();
    const menuUrl = "https://hotel-menu-frontend-kappa.vercel.app/Menu"; // Replace with your actual menu link

useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized! Redirecting...");
        navigate("/admin-login");
    }
}, [navigate]);

    useEffect(() => {
        fetch("https://qr-menu-backend-wc4q.onrender.com/api/menu")
            .then(response => response.json())
            .then(data => {
                setMenu(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Function to handle adding a new menu item
    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // Get the token
    
        if (!token) {
            alert("Unauthorized! Please log in again.");
            navigate("/admin-login");
            return;
        }
    
        const response = await fetch("https://qr-menu-backend-wc4q.onrender.com/api/menu/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include the token
            },
            body: JSON.stringify(newItem),
        });
    
        if (response.ok) {
            const addedItem = await response.json();
            setMenu([...menu, addedItem.menuItem]);
            setNewItem({ name: "", price: "", category: "" });
        } else {
            alert("Failed to add item. Please check your credentials.");
        }
    };
    

    // Function to delete a menu item
    const handleDeleteItem = async (id) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Unauthorized! Please log in again.");
            navigate("/admin-login");
            return;
        }
    
        const response = await fetch(`https://qr-menu-backend-wc4q.onrender.com/api/menu/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`, // Include token
            },
        });
    
        if (response.ok) {
            setMenu(menu.filter(item => item._id !== id));
        } else {
            alert("Failed to delete item. Please check your credentials.");
        }
    };
        // Function to edit a menu item
    const handleEditItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Unauthorized! Please log in again.");
            navigate("/admin-login");
            return;
        }
    
        const response = await fetch(`https://qr-menu-backend-wc4q.onrender.com/api/menu/${editingItem._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include token
            },
            body: JSON.stringify(editingItem),
        });
    
        if (response.ok) {
            const updatedItem = await response.json();
            setMenu(menu.map(item => (item._id === updatedItem.menuItem._id ? updatedItem.menuItem : item)));
            setEditingItem(null); // Clear editing state
        } else {
            alert("Failed to update item.");
        }
    };
    
    const downloadQR = () => {
        const canvas = document.getElementById("menuQR").querySelector("canvas");
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "menu_qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="admin-container">
            <h1>Naky Hotel Menu Dashboard</h1>

            {/* QR Code Section */}
            <div className="qr-code-section">
    <h2>QR Code for Menu</h2>
    <QRCode id="menuQR" value={menuUrl} size={200} />
    <button onClick={() => downloadQR()}>Download QR Code</button>
</div>

            {/* Add New Menu Item */}
            <form onSubmit={handleAddItem} className="admin-menu-item">
                <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required />
                <input type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} required />
                <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} required />
                <button type="submit">Add Item</button>
            </form>

            {/* List of Menu Items */}
            <ul className="admin-menu-list">
    {menu.map((item) => (
        <li key={item._id} className="admin-menu-item">
            {editingItem && editingItem._id === item._id ? (
                // Editable input fields
                <>
                    <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                    <input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    />
                    <button onClick={handleEditItem}>Save</button>
                    <button onClick={() => setEditingItem(null)}>Cancel</button>
                </>
            ) : (
                // Normal view mode
                <>
                    <span>{item.name} - {item.price} Birr - {item.category}</span>
                    <div className="button-group">
                <button className="edit-btn" onClick={() => setEditingItem(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>
            </div>
                </>
            )}
        </li>
    ))}
</ul>

        </div>
    );
};

export default AdminDashboard;
