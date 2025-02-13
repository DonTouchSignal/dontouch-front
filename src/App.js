import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BoardList from './components/BoardList';
import PostDetail from './components/PostDetail';
import PostWrite from './components/PostWrite';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App bg-dark min-vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assets/:assetId/posts" element={<BoardList />} />
          <Route path="/assets/:assetId/posts/write" element={<PostWrite />} />
          <Route path="/assets/:assetId/posts/:postId" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
