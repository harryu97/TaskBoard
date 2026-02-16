import api from "../lib/axios.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserPlus, X, Send } from "lucide-react"


const ShareBoardModal = ({ boardId, onClose }) => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('boards/share', { boardId: boardId, email: email });
      toast.success("Access Granted");
      setEmail("");
      onClose();
    }
    catch (error) {
      toast.error("Failed to grant access");
    } finally {
      setLoading(true);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-base-100 w-full max-w-sm p-6 rounded-xl border border-primary/20 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono font-bold text-primary flex items-center gap-2">
            <UserPlus size={20} /> ADD_COLLABORATOR
          </h2>
          <button onClick={onClose} className="text-base-content/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-primary/60 ml-1">USER_EMAIL_ADDRESS</label>
            <input
              type="email"
              placeholder="friend@example.com"
              className="input input-bordered w-full font-mono text-sm bg-base-200 border-primary/20 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full font-mono gap-2"
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : <Send size={16} />}
            GRANT_ACCESS
          </button>
        </form>
      </div>
    </div>
  );

}
export default ShareBoardModal;

