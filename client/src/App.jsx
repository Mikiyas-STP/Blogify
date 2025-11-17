// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import "./App.css";

function App() {
  return (
    <div>
      {/* NAVBAR will be done here */}
      <main>
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/posts/:id" element={<Post />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
