import React, { useEffect, useState } from 'react';
import api from "../lib/axios.js";
import { useNavigate } from 'react-router';
import toast from "react-hot-toast"

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Loggin in");
    try {
      //send credentials to backend
      const { data } = await api.post('auth/login', { email, password });
      //contain the token in the storage for interceptor 
      console.log(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: data.email, id: data._id }));
      //Go to dashboard 
      toast.success("Welcome!", { id: loadToast });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.data?.message || "Login Failed", { id: loadToast });
    }
  };
  return (
    < div className="min-h-screen flex items-center justify-center bg-base-300" >
      <div className="card w-96 bg-base-100 shadow-xl border border-primary/20">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-primary mb-4">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="ironman@stark.com"
                className="input input-bordered input-primary w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered input-primary w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="card-actions justify-end mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Sign In
              </button>
            </div>
          </form>

          <div className="divider text-xs text-base-content/50">OR</div>

          <p className="text-center text-sm">
            New here? <span className="text-secondary cursor-pointer hover:underline" onClick={() => navigate('/register')}>Create an account</span>
          </p>
        </div>
      </div>
    </div >
  );
};
export default Login;
