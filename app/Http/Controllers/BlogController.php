<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $dbArticles = \App\Models\Article::where('status', 'published')->latest()->get();

        return Inertia::render('Blog', [
            'dbArticles' => $dbArticles,
        ]);
    }

    public function show(Request $request, $id): Response
    {
        $article = \App\Models\Article::where('status', 'published')
            ->where(function($q) use ($id) {
                $q->where('id', $id)->orWhere('slug', $id);
            })->first();

        $allArticles = \App\Models\Article::where('status', 'published')->latest()->get();

        return Inertia::render('BlogDetail', [
            'id' => $id,
            'dbArticle' => $article,
            'dbArticles' => $allArticles,
        ]);
    }
}
