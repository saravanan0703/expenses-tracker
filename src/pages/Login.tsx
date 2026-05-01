import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const validate = () => {
    if (!email || !password) return "Email and password required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    if (password.length < 6) return "Minimum 6 characters required";
    return "";
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) setError(error.message);
    else navigate("/");
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) setError(error.message);
    else setSuccess("Check your email to verify account 🚀");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-200">
      
      {/* --- BACKGROUND DECORATIONS (Replace with actual SVGs/Images if you have them) --- */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      
      {/* Decorative floating shapes */}
      <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-lg rotate-12 opacity-80 shadow-lg hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-80 shadow-lg hidden lg:block"></div>
      <div className="absolute top-1/3 left-1/4 w-8 h-8 border-4 border-indigo-400 rounded-full opacity-60 hidden lg:block"></div>
      {/* -------------------------------------------------------------------------------- */}

      <div className="z-10 container mx-auto px-6 flex flex-col md:flex-row items-center justify-center lg:justify-between gap-12 max-w-5xl">
        
        {/* LEFT SIDE: Typography */}
        <div className="hidden md:flex w-full lg:w-1/2 flex-col justify-center items-start text-slate-800">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">
            Expense Tracker
          </h1>
          <p className="text-xl text-slate-600 max-w-md leading-relaxed">
            Track your daily expenses, manage budgets, and stay financially smart 💰
          </p>
        </div>

        {/* RIGHT SIDE: Form Card */}
        <div className="flex w-full lg:w-1/2 justify-center lg:justify-end items-center relative">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] w-full max-w-md border border-white/50">

            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-xl mb-6 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-green-50 text-green-600 border border-green-100 p-3 rounded-xl mb-6 text-sm font-medium text-center">
                {success}
              </div>
            )}

            {/* EMAIL INPUT */}
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 mb-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <Mail className="text-slate-400" size={20} />
              <input
                className="w-full bg-transparent p-3 outline-none text-slate-700 placeholder-slate-400 font-medium"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 mb-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
              <Lock className="text-slate-400" size={20} />
              <input
                type="password"
                className="w-full bg-transparent p-3 outline-none text-slate-700 placeholder-slate-400 font-medium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end mb-8">
              <span className="text-xs font-semibold text-slate-500 hover:text-cyan-500 cursor-pointer transition-colors">
                Forgot Password?
              </span>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold text-lg p-4 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "SIGN UP"
                : "START NOW"}
            </button>

            {/* TOGGLE LOGIN/SIGNUP */}
            <p className="text-center text-sm font-medium text-slate-500 mt-8">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <span
                className="ml-2 text-cyan-600 hover:text-cyan-500 cursor-pointer transition-colors"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setSuccess("");
                }}
              >
                {isSignup ? "Log In" : "Sign Up"}
              </span>
            </p>
            
          </div>
        </div>

      </div>
    </div>
  );
}