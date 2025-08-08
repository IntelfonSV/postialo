function DefaultContainer({children, className}) {
    return ( 
        <div className={"bg-gray-100 " + className}>
                {children}
        </div>
     );
}
export default DefaultContainer;