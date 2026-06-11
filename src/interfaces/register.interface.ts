
export interface UserDataRegister {
    conferencia_id: number,
    talla_camiseta_id: number,
    nombre: string,
    apellidos: string,
    correo: string,
    telefono: string,
    fecha_nacimiento: string,
    genero: string,
    estado_id: number,
    ciudad: string,
    iglesia: string
    incluir_lunchtime: boolean,
    es_chaperon: boolean,
    pago_lunchtime: string
    pago_camiseta: string
    contacto_emergencia: EmergencyData
}

interface EmergencyData {
    nombre_contacto: string
    telefono_contacto: string,
    relacion: string
}
