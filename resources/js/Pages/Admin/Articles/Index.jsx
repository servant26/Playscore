import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function ArticleIndex({ articles }) {
    const { flash } = usePage().props;
    const [articleToDelete, setArticleToDelete] = useState(null);

    const handleToggleStatus = (article) => {
        router.patch(route('admin.articles.toggle-status', article.id));
    };

    const handleDeleteArticle = () => {
        if (!articleToDelete) return;
        router.delete(route('admin.articles.destroy', articleToDelete.id), {
            onSuccess: () => setArticleToDelete(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Blog Management - Admin" />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2923] pb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F7F5]">
                                Blog Articles Management
                            </h1>
                        </div>
                        <p className="text-[#8B948F] text-sm mt-1">
                            Create, publish, edit, archive, or manage all news and blog articles for Playscore.
                        </p>
                    </div>

                    <Link
                        href={route('admin.articles.create')}
                        className="px-5 py-2.5 rounded-xl bg-[#22C55E] text-[#0B0F0D] font-bold text-sm hover:bg-[#4ADE80] transition shadow-md shadow-[#22C55E]/20 inline-flex items-center gap-2 self-start sm:self-auto"
                    >
                        <span>+ Create New Article</span>
                    </Link>
                </div>

                {/* Flash Notification */}
                {flash?.success && (
                    <div className="bg-[#132015] border border-[#1F3D26] text-[#22C55E] text-sm px-4 py-3 rounded-xl flex items-center justify-between">
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Articles Table */}
                <div className="bg-[#131916] border border-[#1F2923] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-[#8B948F]">
                            <thead className="bg-[#0B0F0D] text-[#F5F7F5] uppercase text-xs border-b border-[#1F2923]">
                                <tr>
                                    <th className="px-6 py-4">Article</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Publisher / Author</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F2923]">
                                {articles.data && articles.data.length > 0 ? (
                                    articles.data.map((art) => (
                                        <tr key={art.id} className="hover:bg-[#161F1A]/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {art.cover ? (
                                                        <img
                                                            src={art.cover}
                                                            alt={art.title}
                                                            className="w-12 h-12 rounded-lg object-cover bg-[#0B0F0D] border border-[#1F2923] shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-[#161F1A] border border-[#1F2923] shrink-0 flex items-center justify-center text-xs text-[#8B948F]">
                                                            No Cover
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 max-w-md">
                                                        <h3 className="font-bold text-[#F5F7F5] truncate text-sm">
                                                            {art.title}
                                                        </h3>
                                                        <p className="text-xs text-[#8B948F] truncate mt-0.5">
                                                            /{art.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 rounded-md bg-[#161F1A] border border-[#22C55E]/20 text-[#22C55E] text-xs font-semibold">
                                                    {art.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <p className="text-[#F5F7F5] font-semibold">{art.publisher || 'Playscore'}</p>
                                                    <p className="text-[#8B948F]">By {art.author || 'Admin'}</p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(art)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                                                        art.status === 'published'
                                                            ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20'
                                                            : 'bg-[#1F2923] border border-[#8B948F]/30 text-[#8B948F] hover:bg-[#161F1A]'
                                                    }`}
                                                    title="Click to toggle status"
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'published' ? 'bg-[#22C55E]' : 'bg-[#8B948F]'}`} />
                                                    <span className="capitalize">{art.status}</span>
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                {new Date(art.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                <Link
                                                    href={route('admin.articles.edit', art.id)}
                                                    className="px-3 py-1.5 rounded-lg bg-[#161F1A] border border-[#1F2923] text-xs font-semibold text-[#F5F7F5] hover:text-[#22C55E] hover:border-[#22C55E]/40 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setArticleToDelete(art)}
                                                    className="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/40 text-xs font-semibold text-red-400 hover:bg-red-900/50 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-[#8B948F]">
                                            No articles created yet. Click "+ Create New Article" to write your first article.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={!!articleToDelete}
                onClose={() => setArticleToDelete(null)}
                onConfirm={handleDeleteArticle}
                title="Delete Article"
                message={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete Article"
            />
        </AppLayout>
    );
}
