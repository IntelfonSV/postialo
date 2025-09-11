import { useEffect, useState } from 'react';

function Search({ placeholder = 'Buscar', datos, keys, setResultados }) {
    /* Este componente recive un array de objetos, el set para almacenar resultados y las llaves que se evaluaran en el objeto */
    const [value, setValue] = useState('');

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    useEffect(() => {
        if (value === '') {
            setResultados(datos);
        } else {
            const upperText = value.toUpperCase();

            const resultadosFiltrados = datos.filter((element) => {
                const match = keys.some((key) => {
                    const value = getNestedValue(element, key);
                    return value?.toUpperCase().includes(upperText);
                });
                return match;
            });
            setResultados(resultadosFiltrados);
        }
    }, [value, datos]);

    return (
        <div className="flex h-10">
            <div className="flex justify-between">
                <div className="max-w-md items-center bg-white">
                    <input
                        type="search"
                        className="h-10 w-full rounded px-4 text-gray-800 focus:outline-none"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default Search;
