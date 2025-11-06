import React from "react";
import { useForm } from "@inertiajs/react";
import {
    TextField,
    MenuItem,
    Button,
    Typography,
    Paper,
    Box,
    Divider,
} from "@mui/material";
import { FiSave } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

export default function ClientForm({ client = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nombre_cliente: client?.nombre_cliente || "",
        nombre_comercial: client?.nombre_comercial || "",
        pais: client?.pais || "",
        telefono: client?.telefono || "",
        correo: client?.correo || "",
        direccion: client?.direccion || "",
        correo_factura: client?.correo_factura || "",
        actividad_comercial: client?.actividad_comercial || "",
        documento_tipo: client?.documento_tipo || "",
        documento_numero: client?.documento_numero || "",
        tipo_persona: client?.tipo_persona || "",
        departamento: client?.departamento || "",
        municipio: client?.municipio || "",
        contacto_nombre: client?.contacto_nombre || "",
        contacto_telefono: client?.contacto_telefono || "",
        contacto_direccion: client?.contacto_direccion || "",
        nit: client?.nit || "",
        nrc: client?.nrc || "",
        categoria: client?.categoria || "",
        tipo_cliente: client?.tipo_cliente || "consumidor_final",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (client) {
            put(route("clients.update", client.id));
        } else {
            post(route("clients.store"));
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography
                variant="h6"
                gutterBottom
                sx={{ mb: 3, fontWeight: "bold" }}
            >
                {client ? "Editar Informacion de facturacion" : "Informacion de facturacion"}
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* --- Información General --- */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                    >
                        Información General
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6">
                            <TextField
                                label="Nombre del cliente"
                                fullWidth
                                value={data.nombre_cliente}
                                onChange={(e) =>
                                    setData("nombre_cliente", e.target.value)
                                }
                                error={!!errors.nombre_cliente}
                                helperText={errors.nombre_cliente}
                            />
                        </div>
                        <div className="md:col-span-6">
                            <TextField
                                label="Nombre comercial"
                                fullWidth
                                value={data.nombre_comercial}
                                onChange={(e) =>
                                    setData("nombre_comercial", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-4">
                            <TextField
                                select
                                label="Tipo de cliente"
                                fullWidth
                                value={data.tipo_cliente}
                                onChange={(e) =>
                                    setData("tipo_cliente", e.target.value)
                                }
                            >
                                <MenuItem value="consumidor_final">
                                    Consumidor Final
                                </MenuItem>
                                <MenuItem value="credito_fiscal">
                                    Crédito Fiscal
                                </MenuItem>
                                <MenuItem value="exterior">Exterior</MenuItem>
                            </TextField>
                        </div>

                        <div className="md:col-span-4">
                            <TextField
                                label="País"
                                fullWidth
                                value={data.pais}
                                onChange={(e) =>
                                    setData("pais", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-4">
                            <TextField
                                label="Teléfono"
                                fullWidth
                                value={data.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-6">
                            <TextField
                                label="Correo principal"
                                fullWidth
                                type="email"
                                value={data.correo}
                                onChange={(e) =>
                                    setData("correo", e.target.value)
                                }
                            />
                        </div>
                        <div className="md:col-span-6">
                            <TextField
                                label="Correo de facturación"
                                fullWidth
                                type="email"
                                value={data.correo_factura}
                                onChange={(e) =>
                                    setData("correo_factura", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </Box>

                {/* --- Datos fiscales --- */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                    >
                        Datos Fiscales
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                            <TextField
                                label="Actividad comercial"
                                fullWidth
                                value={data.actividad_comercial}
                                onChange={(e) =>
                                    setData(
                                        "actividad_comercial",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4"> 
                            <TextField
                                select
                                label="Tipo de documento"
                                className="w-full"
                                value={data.documento_tipo}
                                onChange={(e) =>
                                    setData("documento_tipo", e.target.value)
                                }
                            >
                                <MenuItem value="">Seleccione</MenuItem>
                                <MenuItem value="NIT">NIT</MenuItem>
                                <MenuItem value="NRC">NRC</MenuItem>
                                <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                                <MenuItem value="Otro">Otro</MenuItem>
                            </TextField>

                            <TextField
                                label="Número de documento"
                                fullWidth
                                value={data.documento_numero}
                                onChange={(e) =>
                                    setData("documento_numero", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </Box>

                {/* --- Contacto --- */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                    >
                        Persona de Contacto
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={data.contacto_nombre}
                                onChange={(e) =>
                                    setData("contacto_nombre", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                label="Teléfono"
                                fullWidth
                                value={data.contacto_telefono}
                                onChange={(e) =>
                                    setData("contacto_telefono", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <TextField
                                label="Dirección"
                                fullWidth
                                value={data.contacto_direccion}
                                onChange={(e) =>
                                    setData(
                                        "contacto_direccion",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                </Box>

                {/* --- Botón --- */}
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={client ? <MdEdit /> : <FiSave />}
                        disabled={processing}
                        sx={{ borderRadius: 2, px: 3, py: 1 }}
                    >
                        {client ? "Actualizar Cliente" : "Guardar Cliente"}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}
