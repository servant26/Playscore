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
            className="rounded-lg border border-[#1F2923] text-[#8B948F] px-4 py-2 text-sm hover:border-[#2E3A32] hover:text-[#F5F7F5] transition"
        >
            {copied ? 'Link Copied!' : 'Share'}
        </button>
    );
}