import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RoomPage from './pages/RoomPage';

function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/rooms" element={<RoomPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
