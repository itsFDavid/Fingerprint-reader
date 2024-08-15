import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FingerprintActions from './components/FingerprintActions';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/actions" element={<FingerprintActions />} />
      </Routes>
    </Router>
  );
}

export default App;
