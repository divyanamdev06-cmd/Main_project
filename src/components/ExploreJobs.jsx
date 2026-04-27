import React, { useState } from "react";
import { Briefcase, BarChart, Laptop, Database, Headphones, Shield, Building2, User } from "lucide-react";
const API = "http://localhost:3000/api/v1/category";

const categories = [
  { name: "Operations", icon: <Briefcase size={28} /> },
  { name: "Marketing", icon: <BarChart size={28} /> },
  { name: "Sales", icon: <Briefcase size={28} />, big: true },
  { name: "IT & Software", icon: <Laptop size={28} /> },
  { name: "Data Science", icon: <Database size={28} /> },
  { name: "Customer Service", icon: <Headphones size={28} /> },
  { name: "Insurance", icon: <Shield size={28} /> },
  { name: "BFSI", icon: <Building2 size={28} /> },
  { name: "HR", icon: <User size={28} /> },
];

const ExploreJobs = () => {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <div className="bg-gray-50 py-16">
      
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Heading */}
        <div className="inline-block bg-gray-200 px-6 py-2 rounded-full text-sm font-semibold mb-6">
          EXPLORE JOBS
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-200 rounded-xl p-1 flex ">
            <button
              onClick={() => setActiveTab("category")}
              className={`px-6 py-2 rounded-xl text-sm font-medium ${
                activeTab === "category"
                  ? "bg-white shadow"
                  : "text-gray-600"
              }`}
            >
              By Category
            </button>

            <button
              onClick={() => setActiveTab("mode")}
              className={`px-6 py-2 rounded-xl text-sm font-medium ${
                activeTab === "mode"
                  ? "bg-white shadow"
                  : "text-gray-600"
              }`}
            >
              By Work Mode
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          
          {categories.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl border border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition ${
                item.big ? "md:row-span-2 h-full" : ""
              }`}
            >
              <div className="text-1f3364 mb-3">
                {item.icon}
              </div>

              <p className="font-medium text-gray-700">
                {item.name}
              </p>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default ExploreJobs;
// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:3000/api/v1/category";

// export default function ExpolerJobs() {
//   const [categories, setCategories] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [edit, setEdit] = useState(null);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     description: ""
//   });

//   // FETCH
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`${API}/get`);
//       setCategories(res.data.data);
//     } catch {
//       setError("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // INPUT
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // SUBMIT
//   const handleSubmit = async () => {
//     try {
//       if (!form.name) {
//         setError("Category name required");
//         return;
//       }

//       if (edit) {
//         await axios.put(`${API}/update/${edit._id}`, form);
//       } else {
//         await axios.post(`${API}/create`, form);
//       }

//       setOpen(false);
//       setEdit(null);
//       setForm({ name: "", description: "" });
//       fetchData();
//       setError("");
//     } catch {
//       setError("Something went wrong");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     if (!confirm("Delete category?")) return;
//     try {
//       await axios.delete(`${API}/delete/${id}`);
//       fetchData();
//     } catch {
//       setError("Delete failed");
//     }
//   };

//   // EDIT
//   const handleEdit = (cat) => {
//     setEdit(cat);
//     setForm(cat);
//     setOpen(true);
//   };

//   return (
//     <div className="p-6 bg-white mt-12 h-screen">

//       {/* HEADER */}
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold">Categories</h1>
//         <button
//           onClick={() => setOpen(true)}
//           className="bg-[#F6C85F] px-4 py-2 rounded text-white"
//         >
//           + Add Category
//         </button>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
//           {error}
//         </div>
//       )}

//       {/* CARDS */}
//       <div className="grid md:grid-cols-4 gap-4">
//         {categories.map((cat) => (
//           <div
//             key={cat._id}
//             className="border rounded-xl p-4 text-center hover:shadow-md"
//           >
//             <h2 className="font-semibold">{cat.name}</h2>
//             <p className="text-sm text-gray-500">
//               {cat.description}
//             </p>

//             <div className="flex justify-center gap-3 mt-3 text-sm">
//               <button onClick={() => handleEdit(cat)} className="text-blue-500">
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(cat._id)}
//                 className="text-red-500"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {edit ? "Update Category" : "Add Category"}
//             </h2>

//             <input
//               name="name"
//               placeholder="Category Name"
//               value={form.name}
//               onChange={handleChange}
//               className="input mb-3"
//             />

//             <textarea
//               name="description"
//               placeholder="Description"
//               value={form.description}
//               onChange={handleChange}
//               className="input"
//             />

//             <div className="flex justify-end gap-3 mt-4">
//               <button onClick={() => setOpen(false)} className="border px-3 py-1 rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-[#F6C85F] px-3 py-1 rounded text-white"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );



