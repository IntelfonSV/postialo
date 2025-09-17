import React from "react";

export default function StepCard({ n, title, desc }) {
    return (
        <div className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[#eef2f9]">
            <div className="flex items-center justify-center h-12 w-12 rounded-full mb-4 bg-[#F94B53]">
                <span className="text-xl font-bold text-white">{n}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#002073]">{title}</h3>
            <p className="font-medium text-gray-700 text-sm">{desc}</p>
        </div>
    );
}
