import React, { useState, useEffect } from "react";
import "../Styles/RoomForm.css";

const RoomForm = ({ roomData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    floor: "",
    building: "",
    bed_count: "",
    type: "",
    price: "",
    status: "available",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("👉 Data truyền vào form:", roomData);
    setFormData(roomData || {
      name: "",
      floor: "",
      building: "",
      bed_count: "",
      type: "",
      price: "",
      status: "available",
    });
  }, [roomData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(formData);
    if (result.success) {
      alert(result.message);
      setErrorMessage("");
      onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{formData.id ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Tên phòng" required />
          <input name="floor" type="number" value={formData.floor} onChange={handleChange} placeholder="Tầng" required />
          <input name="building" value={formData.building} onChange={handleChange} placeholder="Tòa nhà" required />
          <input name="bed_count" type="number" value={formData.bed_count} onChange={handleChange} placeholder="Số giường" required />
          <input name="type" value={formData.type} onChange={handleChange} placeholder="Loại phòng" required />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Giá thuê" required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="available">Còn trống</option>
            <option value="occupied">Đã thuê</option>
            <option value="maintenance">Bảo trì</option>
          </select>
          <button type="submit">Lưu</button>
          <button type="button" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
