import { useState } from 'react';

export default function ShareButton({ url }) {
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={copyLink}
            className="rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] font-semibold px-2.5 py-1 text-[11px] sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1 transition shadow-md"
        >
            <span>{copied ? 'Copied!' : 'Share'}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
            </svg>
        </button>
    );
}