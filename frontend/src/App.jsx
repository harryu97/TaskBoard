import CreatePage from "./pages/CreatePage"
import HomePage from "./pages/HomePage"
import NoteDetailPage from "./pages/NoteDetailPage"
import { Route, Routes } from "react-router"
import toast from "react-hot-toast"
const App = () => {
  return (
    <div data-theme="dracula">

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />



      </Routes>



    </div>
  )
}

export default App
