export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    onClose,
    cancelLabel = 'Cancel',
    confirmLabel,
    confirmText,
    variant = 'danger',
}) {
    if (!show) return null;

    const handleClose = onCancel || onClose;
    const finalConfirmText = confirmText || confirmLabel || 'Remove';

    const buttonClass =
        variant === 'success'
            ? 'bg-[#22C55E] hover:bg-[#4ADE80] text-[#0B0F0D]'
            : 'bg-[#DC2626] hover:bg-[#EF4444] text-white';

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={handleClose}
        >
            <div
                className="bg-[#131916] border border-[#1F2923] rounded-xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-[#F5F7F5] text-lg font-semibold mb-2">{title}</h3>
                <p className="text-[#8B948F] text-sm mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg font-semibold px-4 py-2 text-sm transition ${buttonClass}`}
                    >
                        {finalConfirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}