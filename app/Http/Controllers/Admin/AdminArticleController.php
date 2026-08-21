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
