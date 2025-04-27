import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    uploadedBy: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { title, description, uploadedBy, file } = formData;
    
    if (!file) {
      setError("Please upload a file!");
      setIsLoading(false);
      return;
    }

    if (!title || !uploadedBy) {
      setError("Please fill in all required fields!");
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("uploadedBy", uploadedBy);
    form.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/MaterialRoutes/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        alert("Material Uploaded Successfully!");
        navigate("/managematerials");
      }
    } catch (error) {
      console.error("Upload Failed:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes("Network Error")) {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else {
        setError("Failed to upload material. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", borderRadius: "8px", backgroundColor: "#f4f7fc", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <Navbar />
      <h2 style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}>Upload Learning Material</h2>
      
      {error && (
        <div style={{ 
          color: "red", 
          backgroundColor: "#ffebee", 
          padding: "10px", 
          borderRadius: "5px", 
          marginBottom: "20px" 
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ padding: "12px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={{ padding: "12px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px", minHeight: "100px" }}
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
          required
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4,.avi,.mov,.mkv,.flv"
          style={{ padding: "10px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px" }}
        />
        <input
          type="text"
          name="uploadedBy"
          placeholder="Teacher's Name"
          value={formData.uploadedBy}
          onChange={handleChange}
          required
          style={{ padding: "12px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px" }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "12px",
            backgroundColor: isLoading ? "#cccccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            marginTop: "10px",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "#007bff")}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default MaterialUpload;
