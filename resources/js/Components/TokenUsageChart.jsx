import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { LineChart } from '@mui/x-charts/LineChart';

const TokenUsageChart = ({ tokenUsageByMonth }) => {
    // Formatear los datos para MUI X Charts
    const data = tokenUsageByMonth.map(item => {
        const [year, month] = item.month.split('-');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return {
            month: `${monthNames[parseInt(month) - 1]} ${year}`,
            totalTokens: item.total_tokens,
            promptTokens: item.prompt_tokens,
            candidatesTokens: item.candidates_tokens
        };
    });

    if (!tokenUsageByMonth || tokenUsageByMonth.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
                <div className="text-center text-gray-500">
                    <p className="text-lg">No hay datos de uso de tokens disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Uso de Tokens por Mes</h2>
            
            {/* Contenedor responsive horizontal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Gráfica de barras para tokens totales */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Tokens Totales</h3>
                    <BarChart
                        xAxis={[{
                            id: 'barCategories',
                            data: data.map(item => item.month),
                            scaleType: 'band',
                            tickLabelStyle: {
                                angle: -45,
                                textAnchor: 'end',
                                fontSize: 11,
                            },
                        }]}
                        series={[
                            {
                                data: data.map(item => item.totalTokens),
                                label: 'Tokens Totales',
                                color: '#3b82f6',
                                fill: '#3b82f6',
                            },
                        ]}
                        height={250}
                        margin={{ top: 20, right: 30, bottom: 70, left: 50 }}
                    />
                </div>

                {/* Gráfica de líneas para comparación */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 text-gray-700">Comparación de Tipos de Tokens</h3>
                    <LineChart
                        xAxis={[{
                            id: 'lineCategories',
                            data: data.map(item => item.month),
                            scaleType: 'band',
                            tickLabelStyle: {
                                angle: -45,
                                textAnchor: 'end',
                                fontSize: 11,
                            },
                        }]}
                        series={[
                            {
                                data: data.map(item => item.promptTokens),
                                label: 'Tokens de Prompt',
                                color: '#10b981',
                                strokeWidth: 2,
                            },
                            {
                                data: data.map(item => item.candidatesTokens),
                                label: 'Tokens de Respuesta',
                                color: '#f59e0b',
                                strokeWidth: 2,
                            },
                        ]}
                        height={250}
                        margin={{ top: 20, right: 30, bottom: 70, left: 50 }}
                    />
                </div>
            </div>

            {/* Tabla de datos compacta */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Resumen Mensual</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Mes
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Prompt
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    Respuesta
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.month}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                        {new Intl.NumberFormat('es-ES').format(item.totalTokens)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                        {new Intl.NumberFormat('es-ES').format(item.promptTokens)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                                        {new Intl.NumberFormat('es-ES').format(item.candidatesTokens)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TokenUsageChart;
