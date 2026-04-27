import { useCallback, useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import AdminPageHeader from "../components/admin/AdminPageHeader.jsx";
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

export default function Categories({ readOnly = false } = {}) {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    sortOrder: "0",
    isActive: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const payload = await apiGet(`/category/get`);
      setCategories(extractList(payload, ["data", "categories"]));
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setCategories([]);
      toast({ type: "error", title: "Could not load categories", message: msg });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (readOnly) return;
    try {
      if (!form.name?.trim()) {
        setError("Category name required");
        return;
      }

      const body = {
        name: form.name.trim(),
        description: form.description?.trim() ?? "",
        sortOrder: Number(form.sortOrder) || 0,
        isActive: Boolean(form.isActive),
      };

      if (edit) {
        const payload = await apiPut(`/category/update/${edit._id}`, body);
        toast({
          type: "success",
          title: "Category updated",
          message: payload?.message || "Saved.",
        });
      } else {
        const payload = await apiPost(`/category/create`, body);
        toast({
          type: "success",
          title: "Category created",
          message: payload?.message || "Created.",
        });
      }

      setOpen(false);
      setEdit(null);
      setForm({ name: "", description: "", sortOrder: "0", isActive: true });
      fetchData();
      setError("");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Save failed", message: msg });
    }
  };

  const handleDelete = async (id) => {
    if (readOnly) return;
    if (!window.confirm("Delete this category?")) return;
    try {
      await apiDelete(`/category/delete/${id}`);
      fetchData();
      toast({
        type: "success",
        title: "Category deleted",
        message: "Removed.",
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      toast({ type: "error", title: "Delete failed", message: msg });
    }
  };

  const handleEdit = (cat) => {
    if (readOnly) return;
    setEdit(cat);
    setForm({
      name: cat.name ?? "",
      description: cat.description ?? "",
      sortOrder: String(cat.sortOrder ?? 0),
      isActive: cat.isActive !== false,
    });
    setOpen(true);
  };

  return (
    <div className="w-full max-w-6xl">
      <AdminPageHeader
        title={readOnly ? "Job categories" : "Categories"}
        description={
          readOnly
            ? "Active taxonomy used on job posts. Only admins can add or edit categories — you choose them when creating a job."
            : "Organize the job board: names, order, visibility, and descriptions. Deleting a category is blocked while jobs still reference it."
        }
        actions={
          readOnly ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <BookOpen className="mb-1 inline h-4 w-4 text-indigo-600" aria-hidden /> Read-only view
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEdit(null);
                setForm({ name: "", description: "", sortOrder: "0", isActive: true });
                setOpen(true);
              }}
              className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-900/10"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add category
            </button>
          )
        }
      />

      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </div>
      ) : null}

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 py-16 text-center">
          <Tags className="mx-auto h-10 w-10 text-slate-400" aria-hidden />
          <p className="mt-4 font-semibold text-slate-800">No categories yet</p>
          <p className="mt-1 text-sm text-slate-600">
            {readOnly ? "Ask an admin to create categories before posting jobs." : "Create your first category to unlock job posting."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Tags className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Order {cat.sortOrder ?? 0}
                  </span>
                  {cat.isActive === false ? (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                      Inactive
                    </span>
                  ) : (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{cat.name}</h2>
              {cat.slug ? (
                <p className="mt-1 font-mono text-[11px] text-slate-400">/{cat.slug}</p>
              ) : null}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{cat.description || "No description"}</p>
              {!readOnly ? (
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <button type="button" onClick={() => handleEdit(cat)} className="btn btn-outline flex-1 gap-1.5 py-2 text-sm">
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat._id)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!readOnly ? (
        <Modal
          open={open}
          title={edit ? "Update category" : "Add category"}
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
            <input name="name" placeholder="Category name" value={form.name} onChange={handleChange} className="input" />
            <textarea
              name="description"
              placeholder="Description (shown to recruiters when picking a category)"
              value={form.description}
              onChange={handleChange}
              className="input min-h-[110px]"
            />
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Sort order (lower first)
              <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="input" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
              Active on job board
            </label>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
