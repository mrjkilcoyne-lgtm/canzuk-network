import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Community from './pages/Community';
import About from './pages/About';
import Civic from './pages/Civic';
import Guides from './pages/Guides';
import Subscribe from './pages/Subscribe';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/civic" element={<Civic />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
