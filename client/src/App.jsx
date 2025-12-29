import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Blog from './pages/Blog';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import Navbar from './components/Navbar';
import './App.css'; //This line is working

function App() {
  return (
    <div>
      <Navbar />
      <main className="container"> 
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/posts/:id/edit" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
        </Routes>

      </main>
    </div>
  );
}
export default App;