import React, { useEffect, useState } from 'react';
import api from "../lib/axios.js";
import { useNavigate } from 'react-router';
import toast from "react-hot-toast"

import ShareBoardModal from "../components/ShareModal.jsx"
const Dashboard = () => {

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  //If user is not logged in but somehow in this page go back to main 
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]); //same as empty array 
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const [userRes, boardRes] = await Promise.all([api.get('/auth/check'), api.get('/boards')])
        setUser(userRes.data);
        setBoards(boardRes.data);
      } catch (error) {
        console.log("Error at auth", error);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logging out");
    navigate('/');
  };
  //takes event and board id 
  const handleDelete = async (e, board) => {
    e.stopPropagation();
    if (board.creator !== user._id) {
      toast.error("You are not the creator of the board");
      console.log("Not matched");
    }
    if (!window.confirm(`Are you sure you want to delete?`)) return;
    try {
      await api.delete(`/boards/${board._id}`);
      //After removing the board set the board again 
      setBoards(prevBoards => prevBoards.filter((b) => b._id !== board._id));
    } catch (error) {
      toast.error("Failed to delete board");
    }
  };
  const handleCreateBoard = async (e) => {
    e.preventDefault(); //No refreshing 
    try {
      const newBoard = await api.post("/boards", {
        name: newBoardName
      })
      setBoards(prevBoards => [...prevBoards, newBoard.data]);
      setIsModalOpen(false);
      setNewBoardName("");
    } catch (error) {
      toast.error("Failed to create a board");
    }
  }

  return (
    <div className="min-h-screen bg-base-300 p-8 text-base-content">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-primary">
            Welcome, {user?.email?.split('@')[0]}!
          </h1>
          <p className="opacity-60">Ready to build something great today?</p>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost btn-sm text-error">
          Logout
        </button>
      </div>
      {/* BOARDS GRID - 3 in one line on desktop */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Real Board Cards */}
          {boards?.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/board/${board._id}`)} // This makes the whole card clickable
              className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-all border border-transparent hover:border-primary/20"
            >
              <div className="card-body">
                <h2 className="card-title text-secondary">{board.name}</h2> {/* Changed .title to .name based on your DB */}
                <p className="text-sm opacity-70">{board.description}</p>

                <div className="card-actions justify-between items-center mt-4">
                  <div className="badge badge-outline text-xs">
                    {board.creator?.toString() === user?._id.toString() ? "Owner" : "Collaborator"}
                  </div>

                  {/* ONLY show the delete button if the user is the creator */}
                  {board.creator === user?._id && (
                    <button
                      onClick={(e) => handleDelete(e, board)}
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* "Add New" Placeholder Card */}
          <div onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center p-10 hover:bg-accent/5 cursor-pointer transition-colors group">

            <span className="text-4xl text-primary/30 group-hover:text-primary mb-2">+</span>
            <p className="font-bold text-primary/30 group-hover:text-primary">Create Board</p>
          </div>
          {/* Modal Overlay */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              {/* The Window */}
              <div className="bg-base-100 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold mb-6">Create New Board</h2>

                <form onSubmit={handleCreateBoard}>
                  <div className="form-control w-full mb-6">
                    <label className="label">
                      <span className="label-text font-semibold">Board Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Marketing Project"
                      className="input input-bordered w-full"
                      autoFocus
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-8"
                    >
                      Create Board
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};


export default Dashboard;
