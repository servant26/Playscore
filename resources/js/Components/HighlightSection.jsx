import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function HighlightSection({ highlights = [], isOwner = false, myArchivedStories = [], onSelectHighlight }) {
    // Archive Modal State
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [highlightToDelete, setHighlightToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Edit Highlight Modal State
    const [highlightToEdit, setHighlightToEdit] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCoverFile, setEditCoverFile] = useState(null);
    const [editCoverPreview, setEditCoverPreview] = useState(null);
    const [updating, setUpdating] = useState(false);
    const editFileInputRef = useRef(null);

    // Dynamic Items Order State & Drag/Touch State
    const [items, setItems] = useState(highlights);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    // Touch Swap state
    const touchStartRef = useRef(null);
    const activeTouchIdx = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        setItems(highlights);
    }, [highlights]);

    // Save order to server
    const saveNewOrder = (newItems) => {
        const orderIds = newItems.map((i) => i.id);
        router.post(
            route('highlights.reorder'),
            { order: orderIds },
            { preserveScroll: true, preserveState: true }
        );
    };

    // Swap items live in state
    const handleSwapLive = (fromIdx, toIdx) => {
        if (fromIdx === null || toIdx === null || fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= items.length || toIdx >= items.length) return;

        const updated = [...items];
        const [moved] = updated.splice(fromIdx, 1);
        updated.splice(toIdx, 0, moved);
        setItems(updated);
        setDraggedIndex(toIdx);
        setDragOverIndex(null);

        saveNewOrder(updated);
    };

    // HTML5 Drag & Drop handlers (Mouse)
    const handleDragStart = (idx) => {
        setDraggedIndex(idx);
    };

    const handleDragEnter = (idx) => {
        if (draggedIndex !== null && draggedIndex !== idx) {
            setDragOverIndex(idx);
            handleSwapLive(draggedIndex, idx);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Touch Event Handlers (Mobile App-like Hold & Drag Swap)
    const handleTouchStart = (idx, e) => {
        if (!isOwner) return;
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        activeTouchIdx.current = idx;
        setDraggedIndex(idx);
    };

    const handleTouchMove = (e) => {
        if (!isOwner || activeTouchIdx.current === null) return;
        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const itemEl = elements.find((el) => el.getAttribute && el.getAttribute('data-highlight-idx') !== null);

        if (itemEl) {
            const targetIdx = parseInt(itemEl.getAttribute('data-highlight-idx'), 10);
            if (!isNaN(targetIdx) && targetIdx !== activeTouchIdx.current) {
                handleSwapLive(activeTouchIdx.current, targetIdx);
                activeTouchIdx.current = targetIdx;
            }
        }
    };

    const handleTouchEnd = () => {
        if (!isOwner) return;
        activeTouchIdx.current = null;
        touchStartRef.current = null;
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

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

    const [archivePage, setArchivePage] = useState(1);
    const [archivePerPage, setArchivePerPage] = useState(9);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setArchivePerPage(10);
            } else {
                setArchivePerPage(9);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if ((!highlights || highlights.length === 0) && !isOwner) {
        return null;
    }

    return (
        <div className="w-full mb-0">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-[#8B948F] text-xs font-semibold uppercase tracking-wider">
                    Highlights
                </h3>

                {isOwner && (
                    <button
                        type="button"
                        onClick={() => setShowArchiveModal(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#131916] border border-[#1F2923] hover:border-[#22C55E]/50 text-xs font-semibold text-[#22C55E] hover:text-[#4ADE80] transition shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>Archive {myArchivedStories && myArchivedStories.length > 0 ? `(${myArchivedStories.length})` : ''}</span>
                    </button>
                )}
            </div>

            {/* Horizontal Scrollable Highlights Row with smooth transition */}
            <div
                ref={containerRef}
                onTouchMove={handleTouchMove}
                className="flex items-center gap-5 overflow-x-auto py-2 px-2 -mx-2 hide-scrollbar scrollbar-none transition-all duration-300"
            >
                {/* List of Highlights */}
                {items.map((hl, idx) => {
                    const hasStories = hl.stories && hl.stories.length > 0;
                    const isBeingDragged = draggedIndex === idx;

                    return (
                        <div
                            key={hl.id}
                            data-highlight-idx={idx}
                            draggable={isOwner}
                            onDragStart={() => isOwner && handleDragStart(idx)}
                            onDragEnter={() => isOwner && handleDragEnter(idx)}
                            onDragEnd={() => isOwner && handleDragEnd()}
                            onDragOver={(e) => isOwner && e.preventDefault()}
                            onTouchStart={(e) => isOwner && handleTouchStart(idx, e)}
                            onTouchEnd={() => isOwner && handleTouchEnd()}
                            className={`flex flex-col items-center gap-1 shrink-0 group transition-all duration-300 transform select-none ${
                                isOwner ? 'cursor-grab active:cursor-grabbing' : ''
                            } ${
                                isBeingDragged
                                    ? 'scale-110 opacity-70 z-50 shadow-2xl rotate-2'
                                    : 'hover:scale-105'
                            }`}
                        >
                            <div className="relative w-14 h-14 shrink-0 pointer-events-none">
                                <button
                                    type="button"
                                    onClick={() => hasStories && onSelectHighlight({ ...hl, highlightId: hl.id })}
                                    disabled={!hasStories}
                                    className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#22C55E] via-[#16A34A] to-[#86EFAC] shrink-0 pointer-events-auto transition-transform duration-200"
                                >
                                    <div className="w-full h-full rounded-full bg-[#0B0F0D] p-[2px] flex items-center justify-center overflow-hidden">
                                        {hl.cover_url ? (
                                            <img
                                                src={hl.cover_url}
                                                alt={hl.title}
                                                className="w-full h-full object-cover rounded-full pointer-events-none"
                                            />
                                        ) : (
                                            <span className="text-[#22C55E] text-xs font-bold uppercase pointer-events-none">
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
                                    <div className="absolute -top-2 -right-3 flex items-center gap-1 z-30 hidden group-hover:flex pointer-events-auto">
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

                            <span className="text-[11px] font-medium text-[#F5F7F5] truncate max-w-[64px] text-center pointer-events-none">
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
            {/* Story Archive Modal */}
            {showArchiveModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4"
                    onClick={() => setShowArchiveModal(false)}
                >
                    <div
                        className="bg-[#131916] border border-[#1F2923] rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl text-[#F5F7F5] space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#1F2923] pb-3 shrink-0">
                            <div>
                                <h4 className="text-base font-bold text-[#F5F7F5]">Story Archive</h4>
                                <p className="text-xs text-[#8B948F] mt-0.5">
                                    All your past and present stories are safely stored here.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                className="text-[#8B948F] hover:text-[#F5F7F5] transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {!myArchivedStories || myArchivedStories.length === 0 ? (
                            <div className="py-10 text-center">
                                <p className="text-[#8B948F] text-xs">No archived stories found yet.</p>
                                <p className="text-[#5A625D] text-[11px] mt-1">Stories you post will automatically appear in your archive.</p>
                            </div>
                        ) : (
                            (() => {
                                const totalPages = Math.ceil(myArchivedStories.length / archivePerPage) || 1;
                                const paginatedStories = myArchivedStories.slice(
                                    (archivePage - 1) * archivePerPage,
                                    archivePage * archivePerPage
                                );

                                return (
                                    <div className="flex flex-col min-h-0 flex-1">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1 pt-1">
                                            {paginatedStories.map((story) => {
                                                const cover = story.review?.game_cover;
                                                const title = story.review?.game_title || story.rank_name || 'Story';
                                                const rating = story.review?.rating;

                                                return (
                                                    <div
                                                        key={story.id}
                                                        onClick={() => {
                                                            setShowArchiveModal(false);
                                                            onSelectHighlight({ title: 'Archived Story', stories: [story] });
                                                        }}
                                                        className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#1F2923] bg-[#0B0F0D] group cursor-pointer hover:border-[#22C55E]/50 transition shadow-lg flex flex-col justify-between p-3"
                                                    >
                                                        {/* Background Image / Gradient */}
                                                        {cover ? (
                                                            <img
                                                                src={cover}
                                                                alt={title}
                                                                className="absolute inset-0 w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition duration-300"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 bg-gradient-to-b from-[#131916] to-[#0B0F0D]" />
                                                        )}

                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                                                        {/* Top Date Badge */}
                                                        <div className="absolute top-1.5 left-1.5 z-10">
                                                            <span className="bg-black/70 backdrop-blur-md border border-white/10 text-[#A0AABA] text-[9px] font-semibold px-1.5 py-0.5 rounded-md shadow">
                                                                {story.created_at}
                                                            </span>
                                                        </div>

                                                        {/* Bottom Title & Rating (Fixed at bottom) */}
                                                        <div className="relative z-10 text-left mt-auto">
                                                            <h5 className="text-white text-xs font-bold truncate drop-shadow">
                                                                {title}
                                                            </h5>
                                                            {rating && (
                                                                <p className="text-[#22C55E] text-[11px] font-extrabold mt-0.5">
                                                                    ★ {Number(rating).toFixed(1)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1F2923] shrink-0">
                                                <p className="text-xs text-[#8B948F]">
                                                    Page {archivePage} of {totalPages}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setArchivePage((p) => Math.max(1, p - 1))}
                                                        disabled={archivePage === 1}
                                                        className="px-3 py-1.5 rounded-lg border border-[#1F2923] text-xs text-[#8B948F] hover:border-[#2E3A32] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => setArchivePage((p) => Math.min(totalPages, p + 1))}
                                                        disabled={archivePage === totalPages}
                                                        className="px-3 py-1.5 rounded-lg border border-[#1F2923] text-xs text-[#8B948F] hover:border-[#2E3A32] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
