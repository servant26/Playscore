<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminArticleController extends Controller
{
    /**
     * Tag HTML yang diizinkan untuk konten artikel blog.
     * Script, iframe, object, embed, dan event handler TIDAK masuk daftar ini.
     */
    private const ALLOWED_HTML_TAGS = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'figure', 'figcaption',
    ];

    /**
     * Sanitasi konten HTML artikel:
     * - Hanya tag yang ada di ALLOWED_HTML_TAGS yang diizinkan
     * - Atribut berbahaya (event handler, javascript:, data:) dihapus
     */
    private function sanitizeContent(?string $content): ?string
    {
        if (empty($content)) {
            return $content;
        }

        // Step 1: Izinkan hanya tag yang aman
        $allowedTagString = '<' . implode('><', self::ALLOWED_HTML_TAGS) . '>';
        $content = strip_tags($content, $allowedTagString);

        // Step 2: Hapus atribut event handler (onclick, onload, onerror, dst.)
        $content = preg_replace('/\s+on\w+\s*=\s*(["\']).*?\1/si', '', $content);
        $content = preg_replace('/\s+on\w+\s*=\s*[^\s>\'"]+/si', '', $content);

        // Step 3: Hapus href/src yang menggunakan javascript: atau data:
        $content = preg_replace('/(href|src|action)\s*=\s*(["\'])\s*(javascript|data|vbscript):[^\2]*?\2/si', '$1=$2#$2', $content);

        return $content;
    }

    public function index(Request $request): Response
    {
        $articles = Article::latest()->paginate(10);

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'required|string',
            'publisher' => 'nullable|string',
            'publisher_logo' => 'nullable|string',
            'publisher_bg' => 'nullable|string',
            'author' => 'nullable|string',
            'read_time' => 'nullable|string',
            'source_name' => 'nullable|string',
            'source_url' => 'nullable|string',
            'sources' => 'nullable|array',
            'tags' => 'nullable|array',
            'status' => 'required|in:published,archived',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['user_id'] = $request->user()?->id;

        if (empty($validated['author'])) {
            $validated['author'] = $request->user()?->name ?? 'Admin';
        }

        if (empty($validated['publisher'])) {
            $validated['publisher'] = 'Playscore';
        }

        // Sanitasi konten HTML sebelum disimpan — cegah Stored XSS
        if (!empty($validated['content'])) {
            $validated['content'] = $this->sanitizeContent($validated['content']);
        }

        Article::create($validated);

        return redirect()->to(route('admin.dashboard') . '#blog')->with('success', 'Article created successfully.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'cover' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'required|string',
            'publisher' => 'nullable|string',
            'publisher_logo' => 'nullable|string',
            'publisher_bg' => 'nullable|string',
            'author' => 'nullable|string',
            'read_time' => 'nullable|string',
            'source_name' => 'nullable|string',
            'source_url' => 'nullable|string',
            'sources' => 'nullable|array',
            'tags' => 'nullable|array',
            'status' => 'required|in:published,archived',
        ]);

        if ($article->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        }

        // Sanitasi konten HTML sebelum diupdate — cegah Stored XSS
        if (!empty($validated['content'])) {
            $validated['content'] = $this->sanitizeContent($validated['content']);
        }

        $article->update($validated);

        return redirect()->to(route('admin.dashboard') . '#blog')->with('success', 'Article updated successfully.');
    }

    public function toggleStatus(Article $article)
    {
        $newStatus = $article->status === 'published' ? 'archived' : 'published';
        $article->update(['status' => $newStatus]);

        return back()->with('success', "Article status updated to {$newStatus}.");
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return back()->with('success', 'Article deleted successfully.');
    }
}
