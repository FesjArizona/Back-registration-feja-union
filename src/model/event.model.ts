import pool from '../conection/index';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { UserDataRegister } from '../interfaces/register.interface';


export async function getEvents() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT  * FROM eventos');
    return rows
}

export async function getEventById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT  * FROM eventos where id = ?', [id]);
    return rows
}


export async function saveUserRegister(data: UserDataRegister, eventId: number) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const registerQuery = `
            INSERT INTO registros (
                evento_id, conferencia_id, talla_camiseta_id, nombre, apellidos, 
                correo, telefono, fecha_nacimiento, genero, estado_id, ciudad, 
                iglesia, incluir_lunchtime, es_chaperon, pago_camiseta, pago_lunchtime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const registerData = [
            eventId, data.conferencia_id, data.talla_camiseta_id,
            data.nombre, data.apellidos, data.correo,
            data.telefono, data.fecha_nacimiento, data.genero,
            data.estado_id, data.ciudad, data.iglesia,
            data.incluir_lunchtime, data.es_chaperon,
            data.pago_camiseta, data.pago_lunchtime 
        ];

        const [resultRegister] = await connection.execute<ResultSetHeader>(registerQuery, registerData);

        if (resultRegister.affectedRows === 0) {
            throw new Error('Error al insertar el registro principal, no se afectaron filas.');
        }

        const newRegisterId = resultRegister.insertId;

        const queryContactData = `
            INSERT INTO contactos_emergencia (registro_id, nombre_contacto, telefono_contacto, relacion)
            VALUES (?, ?, ?, ?)
        `;
        const contactData = [
            newRegisterId, data.contacto_emergencia.nombre_contacto,
            data.contacto_emergencia.telefono_contacto, data.contacto_emergencia.relacion
        ];

        const [resultContact] = await connection.execute<ResultSetHeader>(queryContactData, contactData);

        if (resultContact.affectedRows === 0) {
            throw new Error('Error al insertar el contacto de emergencia, no se afectaron filas.');
        }

        await connection.commit();
        return newRegisterId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}