import React from 'react';

export default function LoadingDots({ text = 'Loading', className = '' }) {
    return (
        <span className={`inline-flex items-center tracking-wide ${className}`}>
            <span>{text}</span>
            <span className="inline-flex tracking-widest ml-0.5">
                <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }}>.</span>
            </span>
        </span>
    );
}
