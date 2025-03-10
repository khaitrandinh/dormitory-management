import { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState("");

  const fetchData = async () => {
    const response = await axios.post("http://localhost:8000/auth/login", {
      email: "test@example.com",
      password: "password",
    });
    setData(response.data);
  };

  return (
    <div>
      <h1>Quản lý ký túc xá</h1>
      <button onClick={fetchData}>Đăng nhập</button>
      <p>{data ? JSON.stringify(data) : "Chưa có dữ liệu"}</p>
    </div>
  );
}

export default App;