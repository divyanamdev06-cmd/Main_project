
// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = "http://localhost:3000/api/v1/job";

// export default function Jobs() {
//   const [jobs, setJobs] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editJob, setEditJob] = useState(null);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     title: "",
//     company: "",
//     location: "",
//     salary: "",
//     type: "Full-time",
//     mode: "On-site",
//     category: "",
//     description: "",
//   });

//   // FETCH JOBS
//   const fetchJobs = async () => {
//     try {
//       const res = await axios.get(`${API}/get`);
//       setJobs(res.data.jobs);
//     } catch {
//       setError("Failed to load jobs");
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // HANDLE INPUT
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // OPEN EDIT
//   const handleEdit = (job) => {
//     setEditJob(job);
//     setForm(job);
//     setOpen(true);
//   };

//   // SUBMIT (CREATE + UPDATE)
//   const handleSubmit = async () => {
//     try {
//       if (!form.title || !form.company) {
//         setError("Title & Company required");
//         return;
//       }

//       if (editJob) {
//         await axios.put(`${API}/updateJob/${editJob._id}`, form);
//       } else {
//         await axios.post(`${API}/create`, form);
//       }

//       setOpen(false);
//       setEditJob(null);
//       setForm({
//         title: "",
//         company: "",
//         location: "",
//         salary: "",
//         type: "Full-time",
//         mode: "On-site",
//         category: "",
//         description: "",
//       });

//       fetchJobs();
//       setError("");
//     } catch {
//       setError("Something went wrong");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     if (!confirm("Delete this job?")) return;
//     try {
//       await axios.delete(`${API}/deleteJob/${id}`);
//       fetchJobs();
//     } catch {
//       setError("Delete failed");
//     }
//   };

//   // TOGGLE STATUS
//   const handleToggle = async (id) => {
//     try {
//       await axios.patch(`${API}/toggle/${id}`);
//       fetchJobs();
//     } catch {
//       setError("Toggle failed");
//     }
//   };

//   return (
//     <div className="h-screen mt-12 bg-white p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Jobs Management</h1>
//         <button
//           onClick={() => setOpen(true)}
//           className="bg-[#F6C85F] px-4 py-2 rounded-lg text-white"
//         >
//           + Add Job
//         </button>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* JOB LIST */}
//       <div className="grid md:grid-cols-3 gap-4">
//         {jobs.map((job) => (
//           <div key={job._id} className="border p-4 rounded-xl shadow-sm">
//             <h2 className="font-bold text-lg">{job.title}</h2>
//             <p className="text-sm text-gray-500">{job.company}</p>

//             <p className="text-sm mt-2">{job.location}</p>
//             <p className="text-sm">{job.salary}</p>

//             <span
//               className={`text-xs px-2 py-1 rounded ${
//                 job.isActive ? "bg-green-100" : "bg-red-100"
//               }`}
//             >
//               {job.isActive ? "Active" : "Inactive"}
//             </span>

//             <div className="flex gap-3 mt-3 text-sm">
//               <button onClick={() => handleEdit(job)} className="text-blue-500">
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(job._id)}
//                 className="text-red-500"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => handleToggle(job._id)}
//                 className="text-yellow-500"
//               >
//                 Toggle
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">
//               {editJob ? "Update Job" : "Add Job"}
//             </h2>

//             <div className="grid grid-cols-2 gap-3">
//               <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input"/>
//               <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="input"/>
//               <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="input"/>
//               <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className="input"/>
//             </div>

//             <select name="type" value={form.type} onChange={handleChange} className="input mt-3 w-full">
//               <option>Full-time</option>
//               <option>Part-time</option>
//               <option>Internship</option>
//             </select>

//             <select name="mode" value={form.mode} onChange={handleChange} className="input mt-3 w-full">
//               <option>On-site</option>
//               <option>Remote</option>
//               <option>Hybrid</option>
//             </select>

//             <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="input mt-3 w-full"/>

//             <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input mt-3 w-full"/>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   setEditJob(null);
//                 }}
//                 className="px-4 py-2 border rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 bg-[#F6C85F] text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  extractList,
  getApiErrorMessage,
} from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import Modal from "../components/ui/Modal.jsx";

export default function Jobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    mode: "On-site",
    category: "", // 👈 stores category _id
    description: ""
  });

  // FETCH JOBS
  const fetchJobs = async () => {
    try {
      const payload = await apiGet(`/job/get`);
      setJobs(extractList(payload, ["data", "jobs"]));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setJobs([]);
      toast({ type: "error", title: "Could not load jobs", message: msg });
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const payload = await apiGet(`/category/get`);
      setCategories(extractList(payload, ["data", "categories"]));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setCategories([]);
      toast({ type: "error", title: "Could not load categories", message: msg });
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // EDIT
  const handleEdit = (job) => {
    setEditJob(job);
    setForm({
      ...job,
      category: job.category?._id || job.category
    });
    setOpen(true);
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      if (!form.title || !form.company) {
        setError("Title & Company required");
        return;
      }

      if (!form.category) {
        setError("Please select category");
        return;
      }

      if (editJob) {
        const payload = await apiPut(`/job/updateJob/${editJob._id}`, form);
        toast({
          type: "success",
          title: "Job updated",
          message: payload?.message || "Job updated successfully.",
        });
      } else {
        const payload = await apiPost(`/job/create`, form);
        toast({
          type: "success",
          title: "Job created",
          message: payload?.message || "Job created successfully.",
        });
      }

      setOpen(false);
      setEditJob(null);
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "Full-time",
        mode: "On-site",
        category: "",
        description: ""
      });

      fetchJobs();
      setError("");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Save failed", message: msg });
    }
  };

  // DELETE
  // const handleDelete = async (id) => {
  //   if (!confirm("Delete this job?")) return;
  //   try {
  //     await axios.delete(`${JOB_API}/deleteJob/${id}`);
  //     fetchJobs();
  //   } catch {
  //     setError("Delete failed");
  //   }
  // };
  const handleDelete = async (id) => {
  if (!confirm("Delete this job?")) return;

  try {
    const payload = await apiDelete(`/job/${id}`);
    fetchJobs();
    toast({
      type: "success",
      title: "Job deleted",
      message: payload?.message || "Job deleted successfully.",
    });
  } catch (err) {
    const msg = getApiErrorMessage(err);
    setError(msg);
    toast({ type: "error", title: "Delete failed", message: msg });
  }
};

  // TOGGLE
  const handleToggle = async (id) => {
    try {
      const payload = await apiPatch(`/job/toggle/${id}`);
      fetchJobs();
      toast({
        type: "success",
        title: "Status updated",
        message: payload?.message || "Job status updated.",
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Toggle failed", message: msg });
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#F6C85F] text-white px-4 py-2 rounded-lg"
        >
          + Add Job
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* JOB CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="border p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-500">{job.company}</p>

            <p className="text-sm mt-1">{job.location}</p>
            <p className="text-sm">{job.salary}</p>

            {/* CATEGORY NAME */}
            <p className="text-xs text-gray-400 mt-1">
              {job.category?.name || "No Category"}
            </p>

            <span className={`text-xs px-2 py-1 rounded ${job.isActive ? "bg-green-100" : "bg-red-100"}`}>
              {job.isActive ? "Active" : "Inactive"}
            </span>

            <div className="flex gap-3 mt-3 text-sm">
              <button onClick={() => handleEdit(job)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(job._id)} className="text-red-500">Delete</button>
              <button onClick={() => handleToggle(job._id)} className="text-yellow-500">Toggle</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        title={editJob ? "Update Job" : "Add Job"}
        onClose={() => {
          setOpen(false);
          setEditJob(null);
        }}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEditJob(null);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} className="btn btn-primary">
              Save
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="input" />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="input" />
          <input name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className="input" />
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="type" value={form.type} onChange={handleChange} className="input">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>

          <select name="mode" value={form.mode} onChange={handleChange} className="input">
            <option>On-site</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>

        <select name="category" value={form.category} onChange={handleChange} className="input mt-3 w-full">
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="input mt-3 w-full min-h-[110px]"
        />
      </Modal>
    </div >
  );
}

