import { useState } from "react";


const Login = () => {
  const [formData, setFormData] = useState({

    email: "",
    password: "",

  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    console.log(formData);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">

      <div className="bg-fefac7 shadow-2xl rounded-2xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          LOGIN
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <navlink to={"/signup"}>
          <p className="underline text-indigo-600">
            Go to Register
          </p>
          </navlink> */}

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




          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700  transition">
            LOGIN
          </button>






        </form>

      </div>
    </div>
  );
};

export default Login;