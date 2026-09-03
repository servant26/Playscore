<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Playscore') }}</title>

        <!-- Primary Meta Tags -->
        <meta name="title" content="Playscore - Game Database, Reviews & Community Platform">
        <meta name="description" content="Discover, rate, and review your favorite video games on Playscore. Track your game lists, join the gaming community, read latest gaming blogs, and climb the leaderboard.">
        <meta name="keywords" content="playscore, game reviews, gaming database, game ratings, gaming blog, video game tracking, gaming community">
        <meta name="author" content="Playscore">
        <meta name="robots" content="index, follow">

        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="Playscore - Game Database, Reviews & Community Platform">
        <meta property="og:description" content="Discover, rate, and review your favorite video games on Playscore. Track your games, read blogs, and join our active gaming community.">
        <meta property="og:image" content="{{ asset('favicon.svg') }}">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="Playscore - Game Database, Reviews & Community Platform">
        <meta property="twitter:description" content="Discover, rate, and review your favorite video games on Playscore. Track your games, read blogs, and join our active gaming community.">
        <meta property="twitter:image" content="{{ asset('favicon.svg') }}">

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
