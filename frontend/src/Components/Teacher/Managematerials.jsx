import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './Navbar'
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa"; // Importing icons for edit, delete, and add

const ManageMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [newMaterial, setNewMaterial] = useState({ title: "", description: "", uploadedBy: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [currentMaterialId, setCurrentMaterialId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch materials from the server
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get("http://localhost:5000/MaterialRoutes");
                console.log("Materials data:", response.data); // Debug log
                setMaterials(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching materials:", err);
                setError("Failed to load materials");
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    // Handle material form submission (for adding or editing)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                const response = await axios.put(`http://localhost:5000/MaterialRoutes/${currentMaterialId}`, newMaterial);
                setMaterials(materials.map(m => m._id === currentMaterialId ? response.data.updatedMaterial : m));
                alert("Material updated successfully");
            } else {
                const response = await axios.post("http://localhost:5000/MaterialRoutes/upload", newMaterial);
                setMaterials([...materials, response.data.material]);
                alert("Material added successfully");
            }
            setNewMaterial({ title: "", description: "", uploadedBy: "" });
            setIsEditing(false);
            setCurrentMaterialId(null);
        } catch (err) {
            console.error("Error saving material:", err);
            setError(err.response?.data?.message || "Failed to save material");
        }
    };

    // Handle editing a material
    const handleEdit = (material) => {
        setIsEditing(true);
        setCurrentMaterialId(material._id);
        setNewMaterial({
            title: material.title,
            description: material.description,
            uploadedBy: material.uploadedBy,
        });
    };

    // Handle deleting a material
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            try {
                await axios.delete(`http://localhost:5000/MaterialRoutes/${id}`);
                setMaterials(materials.filter((material) => material._id !== id));
                alert("Material deleted successfully");
            } catch (err) {
                console.error("Error deleting material:", err);
                setError("Failed to delete material");
            }
        }
    };

    // Handle downloading a material
    const handleDownload = async (material) => {
        try {
            console.log("Downloading material:", material); // Debug log
            const response = await axios.get(`http://localhost:5000/MaterialRoutes/download/${material._id}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });

            // Get the filename from the Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];
            let filename = material.file?.fileName || 'material.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error downloading material:", err);
            if (err.response?.status === 404) {
                setError("File not found. Please check if the file exists.");
            } else {
                setError("Failed to download material. Please try again.");
            }
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: "20px", marginLeft: "300px", fontFamily: "Arial, sans-serif" }}>
                <Navbar />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        border: "4px solid #f3f3f3", 
                        borderTop: "4px solid #3498db", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite" 
                    }}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", marginLeft: "300px", fontFamily: "Arial, sans-serif" }}>
            <Navbar />
            <h2 style={{ color: "#333", fontSize: "24px", marginBottom: "20px" }}>Manage Learning Materials</h2>
            
            {error && (
                <div style={{ 
                    padding: "10px", 
                    backgroundColor: "#ffebee", 
                    color: "#c62828", 
                    borderRadius: "4px", 
                    marginBottom: "20px" 
                }}>
                    {error}
                </div>
            )}

            {/* Material form for adding or editing */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
                <input
                    type="text"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                    placeholder="Title"
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "300px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                    required
                />
                <input
                    type="text"
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                    placeholder="Description"
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "300px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="text"
                    value={newMaterial.uploadedBy}
                    onChange={(e) => setNewMaterial({ ...newMaterial, uploadedBy: e.target.value })}
                    placeholder="Uploaded By"
                    style={{
                        padding: "10px",
                        width: "100%",
                        maxWidth: "300px",
                        marginBottom: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                    required
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setCurrentMaterialId(null);
                                setNewMaterial({ title: "", description: "", uploadedBy: "" });
                            }}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#f8f9fa",
                                color: "#333",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        {isEditing ? "Update Material" : "Add Material"}
                    </button>
                </div>
            </form>

            {/* List of materials */}
            {materials.length === 0 ? (
                <p style={{ color: "#777", fontSize: "16px" }}>No materials available.</p>
            ) : (
                materials.map((material) => (
                    <div
                        key={material._id}
                        style={{
                            marginBottom: "20px",
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3 style={{ color: "#007bff", fontSize: "18px" }}>{material.title}</h3>
                        <p style={{ color: "#555", fontSize: "14px" }}>{material.description}</p>
                        <p style={{ color: "#888", fontSize: "12px" }}>Uploaded by: {material.uploadedBy}</p>
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <FaDownload
                                onClick={() => handleDownload(material)}
                                style={{ cursor: "pointer", color: "#28a745" }}
                                size={20}
                                title="Download"
                            />
                            <FaEdit
                                onClick={() => handleEdit(material)}
                                style={{ cursor: "pointer", color: "#007bff" }}
                                size={20}
                                title="Edit"
                            />
                            <FaTrash
                                onClick={() => handleDelete(material._id)}
                                style={{ cursor: "pointer", color: "#dc3545" }}
                                size={20}
                                title="Delete"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageMaterials;
