import React, { useState, useEffect } from "react";
import { FaBuilding, FaBed, FaDoorOpen, FaTimes } from "react-icons/fa";
import "../Styles/RoomForm.css";

const RoomForm = ({ roomData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    room_code: "",
    floor: "",
    building: "",
    bed_count: "",
    room_type: "",
    price: "",
    status: "Available", // Default to Available in English
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData(roomData || {
      room_code: "",
      floor: "",
      building: "",
      bed_count: "",
      room_type: "",
      price: "",
      status: "Available",
    });
  }, [roomData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // No need for status mapping, using English throughout
    const payload = { ...formData };
  
    const result = await onSubmit(payload);
    if (result?.success) {
      alert(result.message);
      setErrorMessage("");
      onClose();
    } else {
      setErrorMessage(result?.message || "Save failed. Please try again.");
    }
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              <FaBuilding className="me-2" />
              {roomData?.id ? "Edit Room" : "Add New Room"}
            </h2>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="modal-body">
            <form onSubmit={handleSubmit} id="roomForm" className="room-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="room_code"
                      name="room_code"
                      value={formData.room_code}
                      onChange={handleChange}
                      placeholder="Room Code"
                      required
                    />
                    <label htmlFor="room_code">Room Code</label>
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
                      placeholder="Floor"
                      required
                    />
                    <label htmlFor="floor">Floor</label>
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
                      placeholder="Building"
                      required
                    />
                    <label htmlFor="building">Building</label>
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
                      placeholder="Bed Count"
                      required
                    />
                    <label htmlFor="bed_count">Bed Count</label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="room_type"
                      name="room_type"
                      value={formData.room_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Room Type</option>
                      <option value="standard">Standard</option>
                      <option value="vip">VIP</option>
                    </select>
                    <label htmlFor="room_type">Room Type</label>
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
                      placeholder="Price"
                      required
                    />
                    <label htmlFor="price">Price (VND)</label>
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
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <label htmlFor="status">Status</label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <FaTimes className="me-2" />
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" form="roomForm">
              <FaDoorOpen className="me-2" />
              {roomData?.id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomForm;