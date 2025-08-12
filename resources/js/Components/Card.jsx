function Card({children, className = ""}) {
    return ( 
        <div className={"p-6 bg-white rounded-2xl shadow-lg shadow-black/50 w-full " + className}>
            {children}
        </div>
     );
}

export default Card;    