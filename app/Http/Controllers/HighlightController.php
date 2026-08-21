<?php

namespace App\Http\Controllers;

use App\Models\Highlight;
use App\Models\Story;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class HighlightController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'story_id' => 'nullable|exists:stories,id',
        ]);

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('highlights', 'public');
        }

        $highlight = $request->user()->highlights()->create([
            'title' => $validated['title'],
            'cover_image' => $coverPath,
        ]);

        if (!empty($validated['story_id'])) {
            $highlight->stories()->syncWithoutDetaching([$validated['story_id']]);
        }

        return back()->with('success', 'Highlight created successfully.');
    }

    public function update(Highlight $highlight, Request $request): RedirectResponse
    {
        if ($highlight->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        $data = ['title' => $validated['title']];

        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('highlights', 'public');
            $data['cover_image'] = $coverPath;
        }

        $highlight->update($data);

        return back()->with('success', 'Highlight updated successfully.');
    }

    public function addStory(Highlight $highlight, Request $request): RedirectResponse
    {
        if ($highlight->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'story_id' => 'required|exists:stories,id',
        ]);

        $highlight->stories()->syncWithoutDetaching([$validated['story_id']]);

        return back()->with('success', 'Story added to highlight.');
    }

    public function destroy(Highlight $highlight): RedirectResponse
    {
        if ($highlight->user_id !== auth()->id()) {
            abort(403);
        }

        $highlight->delete();

        return back()->with('success', 'Highlight deleted.');
    }

    public function removeStory(Highlight $highlight, Story $story): RedirectResponse
    {
        if ($highlight->user_id !== auth()->id()) {
            abort(403);
        }

        $highlight->stories()->detach($story->id);

        if ($highlight->stories()->count() === 0) {
            $highlight->delete();
            return back()->with('success', 'Highlight deleted as it had no stories left.');
        }

        return back()->with('success', 'Story removed from highlight.');
    }
}
