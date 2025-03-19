import React, { useState, useEffect } from "react";
import { FaBuilding, FaBed, FaDoorOpen, FaTimes } from "react-icons/fa";
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
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              <FaBuilding className="me-2" />
              {formData.id ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
            </h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* {errorMessage && (
            <div className="alert alert-danger m-3">
              {errorMessage}
            </div>
          )} */}

          <div className="modal-body">
            <form onSubmit={handleSubmit} className="room-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tên phòng"
                      required
                    />
                    <label htmlFor="name">Tên phòng</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      placeholder="Tầng"
                      required
                    />
                    <label htmlFor="floor">Tầng</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="building"
                      name="building"
                      value={formData.building}
                      onChange={handleChange}
                      placeholder="Tòa nhà"
                      required
                    />
                    <label htmlFor="building">Tòa nhà</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="bed_count"
                      name="bed_count"
                      value={formData.bed_count}
                      onChange={handleChange}
                      placeholder="Số giường"
                      required
                    />
                    <label htmlFor="bed_count">Số giường</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      placeholder="Loại phòng"
                      required
                    />
                    <label htmlFor="type">Loại phòng</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Giá thuê"
                      required
                    />
                    <label htmlFor="price">Giá thuê (VNĐ)</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="available">Còn trống</option>
                      <option value="occupied">Đã thuê</option>
                      <option value="maintenance">Bảo trì</option>
                    </select>
                    <label htmlFor="status">Trạng thái</label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <FaTimes className="me-2" />
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" form="roomForm">
              <FaDoorOpen className="me-2" />
              {formData.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;