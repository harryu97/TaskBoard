import CreatePage from "./pages/CreatePage"
import HomePage from "./pages/HomePage"
import NoteDetailPage from "./pages/NoteDetailPage"
import Dashboard from "./pages/Dashboard.jsx"
import Login from "./pages/Login.jsx"
import { Route, Routes } from "react-router"
import toast from "react-hot-toast"
const App = () => {
  return (
    <div data-theme="dracula">

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/board/:boardId" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />



      </Routes>



    </div>
  )
}

export default App
