import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  // ✅ VALIDATION
  const validate = () => {
    if (!email || !password) {
      return "Email and password are required";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const { user } = useAuth();
  useEffect(() => {
  if (user) {
    navigate("/");
  }
}, [user]);

  // 🔐 LOGIN
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

  if (error) {
    setError(error.message);
  } else {
    navigate("/");
  }
};

  // 🆕 SIGNUP
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

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created! Check your email to verify.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="bg-white p-6 rounded-2xl shadow w-80 space-y-4">
        
        <h2 className="text-xl font-bold text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-100 text-green-600 p-2 rounded">
            {success}
          </div>
        )}

        <input
          className="w-full border p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-xl"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* MAIN BUTTON */}
        <button
          className="w-full bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50"
          onClick={isSignup ? handleSignup : handleLogin}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        {/* SWITCH MODE */}
        <p className="text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-indigo-600 cursor-pointer ml-1"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setSuccess("");
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}