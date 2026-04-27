import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api/v1/category";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  // FETCH
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/get`);
      setCategories(res.data.data);
    } catch {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      if (!form.name) {
        setError("Category name required");
        return;
      }

      if (edit) {
        await axios.put(`${API}/update/${edit._id}`, form);
      } else {
        await axios.post(`${API}/create`, form);
      }

      setOpen(false);
      setEdit(null);
      setForm({ name: "", description: "" });
      fetchData();
      setError("");
    } catch {
      setError("Something went wrong");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchData();
    } catch {
      setError("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (cat) => {
    setEdit(cat);
    setForm(cat);
    setOpen(true);
  };

  return (
    <div className="p-6 bg-white mt-12 h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#F6C85F] px-4 py-2 rounded text-white"
        >
          + Add Category
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="border rounded-xl p-4 text-center hover:shadow-md"
          >
            <h2 className="font-semibold">{cat.name}</h2>
            <p className="text-sm text-gray-500">
              {cat.description}
            </p>

            <div className="flex justify-center gap-3 mt-3 text-sm">
              <button onClick={() => handleEdit(cat)} className="text-blue-500">
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {edit ? "Update Category" : "Add Category"}
            </h2>

            <input
              name="name"
              placeholder="Category Name"
              value={form.name}
              onChange={handleChange}
              className="input mb-3"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setOpen(false)} className="border px-3 py-1 rounded">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#F6C85F] px-3 py-1 rounded text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}