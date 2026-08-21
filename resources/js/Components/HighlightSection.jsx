import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';

export default function HighlightSection({ highlights = [], isOwner = false, onSelectHighlight }) {
    // Delete Highlight Confirmation Modal State
    const [highlightToDelete, setHighlightToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Edit Highlight Modal State
    const [highlightToEdit, setHighlightToEdit] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCoverFile, setEditCoverFile] = useState(null);
    const [editCoverPreview, setEditCoverPreview] = useState(null);
    const [updating, setUpdating] = useState(false);
    const editFileInputRef = useRef(null);

    const openEditModal = (e, hl) => {
        e.stopPropagation();
        setHighlightToEdit(hl);
        setEditTitle(hl.title);
        setEditCoverFile(null);
        setEditCoverPreview(hl.cover_url || null);
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditCoverFile(file);
            setEditCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateHighlight = (e) => {
        e.preventDefault();
        if (!highlightToEdit || !editTitle.trim()) return;

        setUpdating(true);
        router.post(
            route('highlights.update', highlightToEdit.id),
            {
                title: editTitle.trim(),
                cover_image: editCoverFile,
            },
            {
                onSuccess: () => {
                    setUpdating(false);
                    setHighlightToEdit(null);
                    setEditCoverFile(null);
                    setEditCoverPreview(null);
                },
                onError: () => setUpdating(false),
            }
        );
    };

    const confirmDeleteHighlight = (e, highlight) => {
        e.stopPropagation();
        setHighlightToDelete(highlight);
    };

    const handleExecuteDelete = () => {
        if (!highlightToDelete) return;
        setDeleting(true);
        router.delete(route('highlights.destroy', highlightToDelete.id), {
            onSuccess: () => {
                setDeleting(false);
                setHighlightToDelete(null);
            },
            onError: () => setDeleting(false),
        });
    };

    if (!highlights || highlights.length === 0) {
        return null;
    }

    return (
        <div className="w-full mb-0">
            <h3 className="text-[#8B948F] text-xs font-semibold uppercase tracking-wider mb-1">
                Highlights
            </h3>

            {/* Horizontal Scrollable Highlights Row */}
            <div className="flex items-center gap-5 overflow-x-auto py-2 px-2 -mx-2 hide-scrollbar scrollbar-none">
                {/* List of Highlights */}
                {highlights.map((hl) => {
                    const hasStories = hl.stories && hl.stories.length > 0;

                    return (
                        <div key={hl.id} className="flex flex-col items-center gap-1 shrink-0 group">
                            <div className="relative w-14 h-14 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => hasStories && onSelectHighlight(hl)}
                                    disabled={!hasStories}
                                    className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] group-hover:scale-105 transition-transform duration-200 shrink-0"
                                >
                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                        {hl.cover_url ? (
                                            <img
                                                src={hl.cover_url}
                                                alt={hl.title}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-[#22C55E] text-xs font-bold uppercase">
                                                {hl.title.slice(0, 2)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] text-[#0B0F0D] border border-[#0B0F0D] flex items-center justify-center text-[9px] font-bold">
                                        {hl.stories ? hl.stories.length : 0}
                                    </span>
                                </button>

                                {/* Owner Controls: Edit & Delete Buttons */}
                                {isOwner && (
                                    <div className="absolute -top-2 -right-3 flex items-center gap-1 z-30 hidden group-hover:flex">
                                        {/* Pencil Edit Icon */}
                                        <button
                                            type="button"
                                            onClick={(e) => openEditModal(e, hl)}
                                            title="Edit Highlight"
                                            className="w-5 h-5 bg-[#131916] border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-[#0B0F0D] rounded-full flex items-center justify-center shadow-xl transition font-bold"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        {/* Cross Delete Icon */}
                                        <button
                                            type="button"
                                            onClick={(e) => confirmDeleteHighlight(e, hl)}
                                            title="Delete Highlight"
                                            className="w-5 h-5 bg-[#EF4444] text-white rounded-full flex items-center justify-center shadow-xl transition font-bold"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <span className="text-[11px] font-medium text-[#F5F7F5] truncate max-w-[64px] text-center">
                                {hl.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Edit Highlight Modal */}
            {highlightToEdit && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4"
                    onClick={() => setHighlightToEdit(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full shadow-2xl text-[#F5F7F5] space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#1F2923] pb-3">
                            <h4 className="text-base font-bold text-[#F5F7F5]">Edit Highlight</h4>
                            <button
                                onClick={() => setHighlightToEdit(null)}
                                className="text-[#8B948F] hover:text-[#F5F7F5] transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateHighlight} className="space-y-4">
                            {/* Cover Image Upload (Optional) */}
                            <div className="flex flex-col items-center justify-center gap-2">
                                <label className="block text-xs font-medium text-[#8B948F]">
                                    Change Cover Image
                                </label>
                                <div
                                    onClick={() => editFileInputRef.current?.click()}
                                    className="w-20 h-20 rounded-full border-2 border-dashed border-[#1F2923] hover:border-[#22C55E] bg-[#0B0F0D] flex items-center justify-center overflow-hidden cursor-pointer transition relative group"
                                    title="Click to change cover image"
                                >
                                    {editCoverPreview ? (
                                        <img src={editCoverPreview} alt="Cover Preview" className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-[#8B948F] group-hover:text-[#22C55E] transition">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-[10px] font-medium">Upload</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditFileChange}
                                    className="hidden"
                                />
                                <p className="text-[11px] text-[#8B948F] text-center">
                                    Click image circle to upload a new cover
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#8B948F] mb-1.5">
                                    Highlight Title
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Highlight title..."
                                    maxLength={50}
                                    required
                                    className="w-full bg-[#0B0F0D] border border-[#1F2923] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] text-[#F5F7F5] rounded-xl px-4 py-2.5 text-sm outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setHighlightToEdit(null)}
                                    className="flex-1 py-3 rounded-xl border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-semibold hover:text-[#F5F7F5] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating || !editTitle.trim()}
                                    className="flex-1 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] rounded-xl text-xs sm:text-sm font-bold transition disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Highlight Confirmation Modal */}
            {highlightToDelete && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4"
                    onClick={() => setHighlightToDelete(null)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full text-center shadow-2xl text-[#F5F7F5] space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-lg font-bold text-[#F5F7F5]">Delete Highlight?</h4>
                        <p className="text-xs sm:text-sm text-[#8B948F] leading-relaxed">
                            Are you sure you want to delete <span className="text-[#F5F7F5] font-semibold">"{highlightToDelete.title}"</span>? Stories inside will remain in your story history.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setHighlightToDelete(null)}
                                className="flex-1 py-3 rounded-xl border border-[#1F2923] text-[#8B948F] text-xs sm:text-sm font-semibold hover:text-[#F5F7F5] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleExecuteDelete}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
