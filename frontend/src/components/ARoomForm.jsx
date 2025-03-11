import React, { useState } from "react";
import "../styles/RoomForm.css";

const RoomForm = ({ roomData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(roomData || {
    name: "",
    floor: "",
    building: "",
    bed_count: "",
    type: "",
    price: "",
    status: "available",  // 🔥 Thêm giá trị mặc định
  });
  
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để hiển thị lỗi

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await onSubmit(formData); // Gọi API từ RoomPage
  
    if (!result || typeof result.success === "undefined") {
      setErrorMessage("Đã xảy ra lỗi không xác định.");
      return;
    }
  
    if (result.success) {
      setErrorMessage(""); // Xóa lỗi nếu có
      alert(result.message || "Thêm phòng thành công!"); // 🔥 Thêm thông báo thành công
      onClose(); // Đóng form
    } else {
      setErrorMessage(result.message || "Có lỗi xảy ra, vui lòng thử lại.");
    }    
  };
  

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{formData.id ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hiển thị lỗi nếu có */}

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
