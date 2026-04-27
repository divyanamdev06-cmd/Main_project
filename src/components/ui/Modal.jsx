export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900">{title}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

