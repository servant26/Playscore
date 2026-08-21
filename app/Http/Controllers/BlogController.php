<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Blog');
    }

    public function show(Request $request, $id): Response
    {
        return Inertia::render('BlogDetail', ['id' => $id]);
    }
}
