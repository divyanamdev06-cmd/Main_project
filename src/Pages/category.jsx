import { useEffect, useState } from "react";
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  extractList,
  getApiErrorMessage,
} from "../lib/apiClient.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import Modal from "../components/ui/Modal.jsx";

export default function Categories() {
  const { toast } = useToast();
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
        const payload = await apiPut(`/category/update/${edit._id}`, form);
        toast({
          type: "success",
          title: "Category updated",
          message: payload?.message || "Category updated successfully.",
        });
      } else {
        const payload = await apiPost(`/category/create`, form);
        toast({
          type: "success",
          title: "Category created",
          message: payload?.message || "Category created successfully.",
        });
      }

      setOpen(false);
      setEdit(null);
      setForm({ name: "", description: "" });
      fetchData();
      setError("");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Save failed", message: msg });
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      const payload = await apiDelete(`/category/delete/${id}`);
      fetchData();
      toast({
        type: "success",
        title: "Category deleted",
        message: payload?.message || "Category deleted successfully.",
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Delete failed", message: msg });
    }
  };

  // EDIT
  const handleEdit = (cat) => {
    setEdit(cat);
    setForm(cat);
    setOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-white mt-12 min-h-screen">

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <Modal
        open={open}
        title={edit ? "Update Category" : "Add Category"}
        onClose={() => {
          setOpen(false);
          setEdit(null);
        }}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setEdit(null);
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
        <div className="space-y-3">
          <input
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="input min-h-[110px]"
          />
        </div>
      </Modal>
    </div>
  );
}