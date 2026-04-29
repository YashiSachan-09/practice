<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class GalleryController extends Controller
{
    public function index(): View
    {
        return view('pages.home', [
            'title' => 'Anayra — Art & Gallery Marketplace',
        ]);
    }

    public function about(): View
    {
        return view('pages.about', [
            'title' => 'Our Story — Anayra',
        ]);
    }

    public function marketplace(): View
    {
        return view('pages.marketplace', [
            'title' => 'Marketplace — Anayra',
        ]);
    }

    public function artists(): View
    {
        return view('pages.artists', [
            'title' => 'Artists — Anayra',
        ]);
    }

    public function exhibitions(): View
    {
        return view('pages.exhibitions', [
            'title' => 'Exhibitions — Anayra',
        ]);
    }

    public function journal(): View
    {
        return view('pages.journal', [
            'title' => 'Journal — Anayra',
        ]);
    }

    public function contact(): View
    {
        return view('pages.contact', [
            'title' => 'Contact — Anayra',
        ]);
    }

    public function submitContact(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'interest' => ['nullable', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:4000'],
        ]);

        return back()->with(
            'status',
            'Thank you, '.$validated['name'].' — your note is received. Our curatorial desk will reply within two business days.'
        );
    }
}
