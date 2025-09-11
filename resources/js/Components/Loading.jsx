function Loading({ title, message }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-white"></div>
            <div className="mt-6 text-center">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {message && <p className="mt-2 text-md text-gray-200">{message}</p>}
            </div>
        </div>
    );
}

export default Loading;
