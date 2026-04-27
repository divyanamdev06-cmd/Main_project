const sizeClass = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, title, children, onClose, footer, size = "md" }) {
  if (!open) return null;

  const maxW = sizeClass[size] || sizeClass.md;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`flex w-full ${maxW} max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4">
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="flex shrink-0 justify-end gap-3 border-t px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

