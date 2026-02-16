import { PenSquareIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router"
import toast from "react-hot-toast"
import { formatDate } from "../lib/utils"
import api from "../lib/axios.js"
import { useState } from "react"
const NoteCard = ({ note, setNotes }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to destroy?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter(note => note._id !== id)) //get rid of deleted one
      toast.success("Deleted Successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete");
    }
  }


  const handleEdit = async (id) => {

    try {
      console.log(id);
      const note = await api.put(`notes/${id}`, { title: note.tile, content: note.content });
      setNotes((prevNotes) => {
        prevNotes.map((n) => (n._id === note._id ? response.data : n));
      });
      toast.success("Note updated");

    } catch (error) {
      toast.error("Failed to update Note");
    }
  }
  return (
    <div className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D] h-full">
      <div className="card-body p-5 flex flex-col justify-between">

        {isEditing ? (
          /* --- EDIT MODE --- */
          <div className="flex flex-col gap-3">
            <input
              className="input input-bordered input-sm bg-base-200 text-primary font-mono font-bold w-full border-primary/20"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="EDIT_TITLE..."
            />
            <textarea
              className="textarea textarea-bordered bg-base-200 text-base-content w-full min-h-[120px] font-mono text-sm border-primary/20 focus:border-primary"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-xs font-mono">
                [ CANCEL ]
              </button>
              <button onClick={handleEdit(note._id)} className="btn btn-primary btn-xs font-mono">
                [ COMMIT_CHANGES ]
              </button>
            </div>
          </div>
        ) : (
          /* --- READ MODE --- */
          <div className="flex flex-col h-full">
            {/* Header Section: Title */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-mono font-bold text-primary tracking-tight break-all uppercase">
                {note.title || "UNTITLED_LOG"}
              </h3>
            </div>

            {/* Content Section */}
            <div className="flex-grow">
              <p className="text-base-content/90 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words italic border-l-2 border-primary/20 pl-3">
                {note.content}
              </p>
            </div>

            {/* Footer Section: Metadata and Actions */}
            <div className="card-actions justify-between items-center mt-6 border-t border-base-content/10 pt-3">
              <div className="flex flex-col">

                <span className="text-[9px] font-mono text-base-content/40">
                  CREATED: {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 p-1"
                  onClick={() => setIsEditing(true)}
                >
                  <PenSquareIcon className="size-4" />
                </button>

                <button
                  className="btn btn-ghost btn-xs text-error hover:bg-error/10 p-1"
                  onClick={() => handleDelete(note._id)}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default NoteCard
