import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function ArticleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        cover: '',
        content: '',
        category: 'PC',
        publisher: 'Playscore',
        publisher_logo: 'P',
        publisher_bg: 'bg-[#22C55E]',
        author: '',
        read_time: '5 min read',
        sources: [{ name: '', url: '' }],
        tags: ['#Gaming', '#News'],
        status: 'published',
    });

    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    const statusRef = useRef(null);
    const categoryRef = useRef(null);
    const leftColumnRef = useRef(null);
    const [leftHeight, setLeftHeight] = useState('auto');

    // Convert array of tags to string format "#Tag1 #Tag2" for input field
    const [rawTagsText, setRawTagsText] = useState(() => (data.tags || []).join(' '));

    // Auto-sync right column scroll area height with left column
    useEffect(() => {
        const updateHeight = () => {
            if (leftColumnRef.current) {
                setLeftHeight(`${leftColumnRef.current.offsetHeight}px`);
            }
        };

        updateHeight();
        const resizeObserver = new ResizeObserver(updateHeight);
        if (leftColumnRef.current) {
            resizeObserver.observe(leftColumnRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setStatusDropdownOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTagsTextChange = (e) => {
        const text = e.target.value;
        setRawTagsText(text);

        // Extract words starting with # (e.g. #MetalGearSolid #Konami)
        const parsedHashtags = text
            .split(/\s+/)
            .filter((token) => token.startsWith('#') && token.length > 1);

        // Remove duplicates while keeping order
        const uniqueHashtags = Array.from(new Set(parsedHashtags));
        setData('tags', uniqueHashtags);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.articles.store'));
    };

    const STATUS_OPTIONS = [
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' },
    ];

    const EXISTING_CATEGORIES = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Esports', 'Hardware', 'Mobile'];

    const filteredCategories = EXISTING_CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(data.category.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Create New Article - Admin" />

            <style>{`
                .ck-editor__editable_inline {
                    min-height: 240px;
                    background-color: #0E1411 !important;
                    color: #F5F7F5 !important;
                    border-color: #1F2923 !important;
                    border-bottom-left-radius: 0.75rem !important;
                    border-bottom-right-radius: 0.75rem !important;
                }
                .ck.ck-toolbar {
                    background-color: #131916 !important;
                    border-color: #1F2923 !important;
                    border-top-left-radius: 0.75rem !important;
                    border-top-right-radius: 0.75rem !important;
                }
                .ck.ck-toolbar .ck-button {
                    color: #F5F7F5 !important;
                }
                .ck.ck-toolbar .ck-button:hover {
                    background-color: #1F2923 !important;
                }

                /* Custom Dark Scrollbar */
                .custom-dark-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-dark-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-dark-scrollbar::-webkit-scrollbar-thumb {
                    background: #1F2923;
                    border-radius: 9999px;
                }
                .custom-dark-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #22C55E;
                }
            `}</style>

            <div className="py-4 sm:py-6 space-y-6">
                {/* Header & Breadcrumb */}
                <div className="border-b border-[#1F2923] pb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7F5]">
                        Create New Article
                    </h1>
                    <nav className="flex items-center gap-1.5 text-xs text-[#8B948F] mt-2 font-medium">
                        <Link href={route('admin.dashboard')} className="hover:text-[#22C55E] transition">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-[#F5F7F5]">Create Blog & Articles</span>
                    </nav>
                </div>

                {/* Article Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Main Editor & Core Content */}
                    <div ref={leftColumnRef} className="lg:col-span-8 space-y-5">
                        {/* Title */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 sm:p-5 rounded-2xl space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Article Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter article headline or news title..."
                                className="w-full px-4 py-2.5 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] placeholder-[#8B948F] text-sm focus:outline-none focus:border-[#22C55E]"
                                required
                            />
                            {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
                        </div>

                        {/* Cover Image URL */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 sm:p-5 rounded-2xl space-y-2.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={data.cover}
                                onChange={(e) => setData('cover', e.target.value)}
                                placeholder="Enter featured cover image URL (e.g., https://example.com/cover.jpg)..."
                                className="w-full px-4 py-2 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] placeholder-[#8B948F] text-xs focus:outline-none focus:border-[#22C55E]"
                            />
                            {data.cover && (
                                <div className="h-36 sm:h-40 w-full rounded-xl overflow-hidden border border-[#1F2923] bg-[#0E1411]">
                                    <img
                                        src={data.cover}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* CKEditor Article Content Body */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 sm:p-5 rounded-2xl space-y-2.5">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8B948F]">
                                Article Content (CKEditor) <span className="text-red-500">*</span>
                            </label>

                            <CKEditor
                                editor={ClassicEditor}
                                data={data.content}
                                onChange={(event, editor) => {
                                    const editorData = editor.getData();
                                    setData('content', editorData);
                                }}
                            />
                            {errors.content && <p className="text-red-400 text-xs">{errors.content}</p>}
                        </div>
                    </div>

                    {/* Right Column: Scrollable Settings on Desktop (lg:), Full flow on Mobile/Tablet */}
                    <div
                        style={{ height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? leftHeight : 'auto' }}
                        className="lg:col-span-4 lg:overflow-y-auto lg:pr-3 space-y-4 custom-dark-scrollbar"
                    >
                        {/* Status & Publication Box */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 rounded-2xl space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F] pb-2 border-b border-[#1F2923]">
                                Publishing Options
                            </h3>

                            <div className="space-y-1.5 relative" ref={statusRef}>
                                <label className="block text-xs text-[#8B948F] font-medium">Status</label>

                                {/* Custom Playscore Dark Dropdown */}
                                <button
                                    type="button"
                                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0E1411] border border-[#1F2923] hover:border-[#22C55E]/60 text-[#F5F7F5] text-xs font-semibold transition"
                                >
                                    <span>
                                        {STATUS_OPTIONS.find((s) => s.value === data.status)?.label || 'Select Status'}
                                    </span>
                                    <span className={`transition-transform duration-200 text-[#8B948F] ${statusDropdownOpen ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>

                                {statusDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                                        {STATUS_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setData('status', opt.value);
                                                    setStatusDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs font-semibold transition flex items-center justify-between ${data.status === opt.value
                                                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                                        : 'text-[#8B948F] hover:bg-[#161F1A] hover:text-[#F5F7F5]'
                                                    }`}
                                            >
                                                <span>{opt.label}</span>
                                                {data.status === opt.value && <span>✓</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category & Read Time */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 rounded-2xl space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F] pb-2 border-b border-[#1F2923]">
                                Category & Format
                            </h3>

                            <div className="space-y-1.5 relative" ref={categoryRef}>
                                <label className="block text-xs text-[#8B948F] font-medium">Platform Category</label>

                                {/* Editable Typeable Category Combobox Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => {
                                            setData('category', e.target.value);
                                            setCategoryDropdownOpen(true);
                                        }}
                                        onFocus={() => setCategoryDropdownOpen(true)}
                                        placeholder="Type category or select existing..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] text-xs focus:outline-none focus:border-[#22C55E]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                        className="absolute right-3 top-2.5 text-[#8B948F] text-xs"
                                    >
                                        ▼
                                    </button>
                                </div>

                                {categoryDropdownOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#131916] border border-[#1F2923] rounded-xl shadow-2xl z-30 py-1 overflow-hidden max-h-40 overflow-y-auto custom-dark-scrollbar">
                                        {filteredCategories.length > 0 ? (
                                            filteredCategories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => {
                                                        setData('category', cat);
                                                        setCategoryDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition flex items-center justify-between ${data.category === cat
                                                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                                                            : 'text-[#8B948F] hover:bg-[#161F1A] hover:text-[#F5F7F5]'
                                                        }`}
                                                >
                                                    <span>{cat}</span>
                                                    {data.category === cat && <span>✓</span>}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-xs text-[#22C55E] italic bg-[#22C55E]/5 border-t border-[#1F2923]">
                                                + Press enter/save to create "{data.category}" category
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#8B948F] font-medium">Estimated Read Time</label>
                                <input
                                    type="text"
                                    value={data.read_time}
                                    onChange={(e) => setData('read_time', e.target.value)}
                                    placeholder="e.g. 5 min read"
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] text-xs focus:outline-none focus:border-[#22C55E]"
                                />
                            </div>
                        </div>

                        {/* Publisher & Source */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 rounded-2xl space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F] pb-2 border-b border-[#1F2923]">
                                Publisher & News Source
                            </h3>

                            <div className="space-y-1.5">
                                <label className="block text-xs text-[#8B948F] font-medium">Publisher Name</label>
                                <input
                                    type="text"
                                    value={data.publisher}
                                    onChange={(e) => setData('publisher', e.target.value)}
                                    placeholder="Enter publisher name (e.g., Playscore Editorial)..."
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] text-xs focus:outline-none focus:border-[#22C55E]"
                                />
                            </div>

                            {/* Dynamic Article Sources (Multiple Support) */}
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs text-[#8B948F] font-medium">Article Sources / References</label>
                                    <button
                                        type="button"
                                        onClick={() => setData('sources', [...(data.sources || []), { name: '', url: '' }])}
                                        className="text-[11px] font-bold text-[#22C55E] hover:underline flex items-center gap-1"
                                    >
                                        + Add Source
                                    </button>
                                </div>

                                {(data.sources || []).map((src, idx) => (
                                    <div key={idx} className="space-y-1.5 p-2.5 rounded-xl bg-[#0E1411] border border-[#1F2923] relative group">
                                        <div className="flex items-center justify-between gap-2">
                                            <input
                                                type="text"
                                                value={src.name}
                                                onChange={(e) => {
                                                    const updated = [...data.sources];
                                                    updated[idx].name = e.target.value;
                                                    setData('sources', updated);
                                                }}
                                                placeholder={`Source #${idx + 1} Name (e.g. IGN, Kotaku)...`}
                                                className="w-full bg-transparent border-none text-[#F5F7F5] placeholder-[#5A625D] text-xs focus:outline-none font-medium"
                                            />
                                            {data.sources.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = data.sources.filter((_, i) => i !== idx);
                                                        setData('sources', updated);
                                                    }}
                                                    className="text-red-400 hover:text-red-300 text-xs px-1"
                                                    title="Remove source"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="url"
                                            value={src.url}
                                            onChange={(e) => {
                                                const updated = [...data.sources];
                                                updated[idx].url = e.target.value;
                                                setData('sources', updated);
                                            }}
                                            placeholder="https://example.com/news-article..."
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] text-[11px] focus:outline-none focus:border-[#22C55E]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hashtags Input Box */}
                        <div className="bg-[#131916] border border-[#1F2923] p-4 rounded-2xl space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B948F] pb-2 border-b border-[#1F2923]">
                                Article Hashtags
                            </h3>

                            <textarea
                                value={rawTagsText}
                                onChange={handleTagsTextChange}
                                placeholder="Enter or paste hashtags separated by space (e.g., #Playscore #GamingNews #ReleaseDate)..."
                                rows="3"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1411] border border-[#1F2923] text-[#F5F7F5] placeholder-[#5A625D] text-xs focus:outline-none focus:border-[#22C55E] leading-relaxed"
                            />

                            {/* Detected Valid Hashtags Badges */}
                            {data.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {data.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md bg-[#161F1A] border border-[#22C55E]/30 text-[11px] font-semibold text-[#22C55E]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button (Pushed to bottom) */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-sm hover:bg-[#4ADE80] transition shadow-lg shadow-[#22C55E]/20"
                        >
                            {processing ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
