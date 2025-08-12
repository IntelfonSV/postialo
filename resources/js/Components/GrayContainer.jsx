function GrayContainer({children}) {
    return (
        <div className="flex justify-between w-full items-center my-5 bg-gray-200 p-5 rounded-xl shadow-gray-500 shadow-md border-gray-200 border">
            {children}
        </div>
    );
}

export default GrayContainer;