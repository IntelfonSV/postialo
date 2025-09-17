import React from "react";

export function PcIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l-1.332 1.332a.75.75 0 01-1.06 0L9.22 15H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h3.382l.668.668a.25.25 0 00.354 0l.668-.668H15a1 1 0 001-1V5a1 1 0 00-1-1H5z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function MobileIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM3.5 4.25a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v11.5a.75.75 0 00-.75-.75H4.25a.75.75 0 01-.75-.75V4.25z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function ShieldIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 01.375.098l7.5 4.167a.75.75 0 01.375.652V12c0 4.97-3.114 8.833-7.26 9.917a.75.75 0 01-.38 0C8.464 20.833 5.25 16.97 5.25 12V7.167a.75.75 0 01.375-.652l7.5-4.167A.75.75 0 0112 2.25zm-.53 9.22a.75.75 0 011.06 0l2.47 2.47 3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3-3a.75.75 0 010-1.06z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function PlusSquareIcon({ className = "h-5 w-5" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path d="M10 2a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 2z" />
            <path
                fillRule="evenodd"
                d="M3 5.5A2.5 2.5 0 015.5 3h9A2.5 2.5 0 0117 5.5v9a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 013 14.5v-9zM4.5 14.5a1 1 0 001 1h9a1 1 0 001-1v-9a1 1 0 00-1-1h-9a1 1 0 00-1 1v9z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function ShieldCheck({ className = "h-6 w-6 text-[#002073]" }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}
