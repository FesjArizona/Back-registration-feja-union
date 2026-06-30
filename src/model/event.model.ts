import pool from '../conection/index';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PayData, UserDataRegister } from '../interfaces/register.interface';


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

export async function getEventRegistrations(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        select r.conferencia_id, r.talla_camiseta_id, estado_id,ciudad,r.id, r.nombre, r.apellidos, r.telefono, r.correo,r.checkin_at,r.pago_camiseta,r.pago_lunchtime,r.created_at,c.nombre as conferencia , e.nombre as estado , tc.talla 
        from registros r
        inner join conferencias c on c.id = r.conferencia_id
        inner join 	estados e on e.id = r.estado_id
        inner join tallas_camiseta tc on tc.id = r.talla_camiseta_id where r.evento_id = ?
        `, [eventId]);
    return rows
}

export async function getRegistration(registerId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM registros where id = ?', [registerId]);
    return rows
}

export async function checkIn(registerId: number, adminId: number) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const queryUpdate = `
            UPDATE registros 
            SET checkin_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND checkin_at IS NULL
        `;
        const [resultUpdate] = await connection.execute<ResultSetHeader>(queryUpdate, [registerId]);

        if (resultUpdate.affectedRows === 0) {
            throw new Error('El registro no existe o ya tiene check-in.');
        }

        const queryLog = `
            INSERT INTO log_checkins (registro_id, admin_id) 
            VALUES (?, ?)
        `;
        await connection.execute<ResultSetHeader>(queryLog, [registerId, adminId]);

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function updatePaymentRegister(registroId: number, adminId: number, data: PayData) {
    const connection = await pool.getConnection();
    let updateRequireLunchTime = ""
    try {
        await connection.beginTransaction();

        const columnaDestino = data.concepto === 'camiseta' ? 'pago_camiseta' : 'pago_lunchtime';
        if (data.concepto === 'lunchtime') {
            if (data.estatus_nuevo === 'pagado' || data.estatus_nuevo === 'pendiente') {
                updateRequireLunchTime = ", incluir_lunchtime = 1";
            } else if (data.estatus_nuevo === 'no_aplica') {
                updateRequireLunchTime = ", incluir_lunchtime = 0";
            }
        }
        const queryUpdate = `
            UPDATE registros 
            SET ${columnaDestino} = ? ${updateRequireLunchTime}
            WHERE id = ?
        `;
        const [resultUpdate] = await connection.execute<ResultSetHeader>(queryUpdate, [
            data.estatus_nuevo,
            registroId
        ]);

        if (resultUpdate.affectedRows === 0) {
            throw new Error('El registro no existe o no pudo ser actualizado.');
        }

        const queryLog = `
            INSERT INTO log_pagos (registro_id, admin_id, concepto, estatus_nuevo, notas) 
            VALUES (?, ?, ?, ?, ?)
        `;

        const notasParaGuardar = data.notas ? data.notas : null;

        await connection.execute<ResultSetHeader>(queryLog, [
            registroId,
            adminId,
            data.concepto,
            data.estatus_nuevo,
            notasParaGuardar
        ]);

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export async function removeRegister(registerId: number) {
    await pool.query('DELETE FROM registros WHERE id = ?', [registerId]);
}