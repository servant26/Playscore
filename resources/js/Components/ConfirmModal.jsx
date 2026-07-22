export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    cancelLabel = 'Cancel',
    confirmLabel = 'Remove',
}) {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={onCancel}
        >
            <div
                className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-[#F5F7F5] text-lg font-semibold mb-2">{title}</h3>
                <p className="text-[#8B948F] text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                        className="rounded-lg font-medium px-4 py-2 text-sm hover:opacity-90 transition"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}