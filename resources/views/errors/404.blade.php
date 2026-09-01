<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Page Not Found | Playscore</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Figtree', sans-serif;
            background-color: #0B0F0D;
            color: #F5F7F5;
        }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col justify-between bg-[#0B0F0D] p-6 sm:p-10">

    <!-- Navbar Minimal -->
    <header class="max-w-6xl mx-auto w-full flex items-center justify-between">
        <a href="{{ url('/') }}" class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center">
                <span class="text-[#0B0F0D] font-bold text-sm">P</span>
            </div>
            <span class="text-[#F5F7F5] font-semibold text-lg tracking-tight">
                Playscore
            </span>
        </a>
        <div></div>
    </header>

    <!-- Center Content -->
    <main class="max-w-md mx-auto w-full text-center my-auto py-12 space-y-6">
        <!-- Clean Green 404 Text -->
        <div class="text-6xl sm:text-7xl font-bold text-[#22C55E]">
            404
        </div>

        <!-- Title & Description -->
        <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-bold text-[#F5F7F5]">
                Lost in the Game?
            </h1>
            <p class="text-[#8B948F] text-sm leading-relaxed max-w-sm mx-auto">
                The page or game you're looking for doesn't exist, has been removed, or is temporarily unavailable.
            </p>
        </div>

        <!-- Action Buttons (Ukuran Sedang / Proporsional Ideal) -->
        <div class="flex items-center justify-center gap-3 pt-2">
            <a href="{{ url('/') }}" class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#22C55E] text-[#0B0F0D] font-semibold text-sm hover:bg-[#16A34A] transition text-center whitespace-nowrap">
                Back to Homepage
            </a>
            <button type="button" onclick="window.history.back()" class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#131916] border border-[#1F2923] text-[#8B948F] font-medium text-sm hover:border-[#2E3A32] hover:text-[#F5F7F5] transition text-center cursor-pointer whitespace-nowrap">
                Previous Page
            </button>
        </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-6xl mx-auto w-full text-center text-xs text-[#5A625D]">
        © {{ date('Y') }} Playscore. All rights reserved.
    </footer>

</body>
</html>
