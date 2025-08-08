function Card({children}) {
    return ( 
        <div className="p-6 bg-white rounded-2xl shadow-lg shadow-black/50 w-full">
            {children}
        </div>
     );
}

export default Card;    