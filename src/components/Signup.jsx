 import { useState } from "react";
 import axios from "axios";
import { NavLink } from "react-router-dom";
 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   async function handleSubmit(e) {
    e.preventDefault();

    const res= await axios.post("http://localhost:3000/api/v1/user/signup",formData)
    console.log(res)
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      
      <div className="bg-fefac7 shadow-2xl rounded-2xl w-full max-w-md p-8">
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
         Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            onChange={handleChange}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="student">user</option>
            <option value="admin">admin</option>
          </select>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700  transition">
            Register Now
          </button>

          <NavLink to={"/login"}>
          <p className="mt-1 text-balck text-center ">Registration now #Login here</p> 
          </NavLink>
          
        </form>

      </div>
    </div>
  );
};

export default Signup;