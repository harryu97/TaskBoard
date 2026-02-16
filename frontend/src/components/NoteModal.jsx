import { useState } from "react"
import api from "../lib/axios.js"
import toast from "react-hot-toast"

const NoteModal = ({ boardId, setNotes, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      console.log(boardId);
      const response = await api.post("/notes", {
        title: title,
        content: content,
        boardId: boardId
      });
      //Update the notes so notes appear 
      setNotes((prev) => [...prev, response.data]);
      toast.success("Note added");
      onClose(); //close the modal 
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-base-content/10">
        <h2 className="text-2xl font-bold mb-4 text-primary">New Note</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea textarea-bordered w-full h-20 text-lg leading-relaxed focus:border-primary outline-none"
            placeholder="Type the name of your new note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />

          <textarea
            className="textarea textarea-bordered w-full h-40 text-lg leading-relaxed focus:border-primary outline-none"
            placeholder="What's the plan? Type it here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Saving..." : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal
