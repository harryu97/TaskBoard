import NavBar from "../components/NavBar"
import { useState } from "react"
import { useEffect } from "react"
import NotesNotFound from "../components/NotesNotFound.jsx"
import axios from "axios"
import RateLimitedUI from "../components/RateLimitedUI.jsx"
import NoteCard from "../components/NoteCard.jsx"
import toast from "react-hot-toast"
import api from "../lib/axios.js"
const HomePage = () => {
  const [rateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        //const res = await fetch("http://localhost:5001/api/notes")
        //const data = await res.json();
        const res = await api.get("/notes")
        console.log(res.data);
        setNotes(res.data)
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log("error");
        if (error.response.status == 429) {
          setIsRateLimited(true)
        }
        else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes()
  }, [])
  return (

    <div className="min-h-screen"><NavBar />
      {rateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">loading notes...</div>}

        {notes.length == 0 && !rateLimited && <NotesNotFound />}
        {notes.length > 0 && !rateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:gri-cols-3 gap-6">
            {notes.map((note) =>
            (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
