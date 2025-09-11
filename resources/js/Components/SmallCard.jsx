function SmallCard({title, bg = 'bg-indigo-600', value, icon, onClick =()=>{}}) {
    return (
        <div className="w-auto min-w-64 hover:cursor-pointer" onClick={onClick}>
            <div className="flex items-center rounded-md bg-white px-5 py-6 shadow-sm">
                <div className={`rounded-full bg-opacity-75 p-3 ` + bg}>
                    {icon}
                </div>

                <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">
                        {value}
                    </h4>
                    <div className="text-gray-500">{title}</div>
                </div>
            </div>
        </div>
    );
}

export default SmallCard;
