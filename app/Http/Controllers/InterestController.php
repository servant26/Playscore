<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InterestController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'interests' => ['array'],
            'interests.*' => ['exists:interests,id'],
        ]);

        $request->user()->interests()->sync($request->input('interests', []));

        return back();
    }
}