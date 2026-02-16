import NavBar from "../components/NavBar"
import { useState } from "react"
import { useEffect } from "react"

import { PlusIcon, UserPlus, ArrowLeft } from "lucide-react"
import NotesNotFound from "../components/NotesNotFound.jsx"
import axios from "axios"
import Link from "react-router"
import RateLimitedUI from "../components/RateLimitedUI.jsx"
import NoteCard from "../components/NoteCard.jsx"
import NoteModal from "../components/NoteModal.jsx"
import toast from "react-hot-toast"
import api from "../lib/axios.js"
import { useParams } from "react-router"
import ShareBoardModal from "../components/ShareModal.jsx"
const HomePage = () => {
  const { boardId } = useParams();
  const [rateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([])

  const [showShareModal, setShowShareModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true)

  //Only whenever the site is refreshed or for the first time 
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log(boardId);
        const notes = await api.get(`/notes/${boardId}`);
        setNotes(notes.data)
        setIsRateLimited(false);
        console.log(notes.data);
      } catch (error) {
        console.log("Error fetching notes");
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
    if (boardId) fetchNotes()
  }, [boardId]);
  return (

    <div className="min-h-screen"><NavBar />
      {rateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">loading notes...</div>}


        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Your Notes</h1>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="btn btn-outline btn-sm font-mono gap-2"
          >
            <UserPlus size={16} /> SHARE
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform"
          >
            <PlusIcon className="mr-2" />
            New Note
          </button>

          {showShareModal && (
            <ShareBoardModal
              boardId={boardId}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </div>
        {notes.length == 0 && !rateLimited && <NotesNotFound />}
        {notes.length > 0 && !rateLimited && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:gri-cols-6 gap-6">
            {notes.map((note) =>
            (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}

          </div>
        )}
        {isModalOpen && (<NoteModal boardId={boardId} setNotes={setNotes} onClose={() => setIsModalOpen(false)} />)}
      </div>
    </div>
  )
}

export default HomePage
