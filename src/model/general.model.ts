import pool from '../conection/index';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function getConferences(stateId: number) {

    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT c.id, c.nombre, c.codigo, e.nombre as estado
        FROM conferencias c
        INNER JOIN conferencia_estado ce ON ce.conferencia_id = c.id
        INNER JOIN estados e ON e.id = ce.estado_id
        WHERE ce.estado_id = ?`, [stateId]
    );
    return rows

}

export async function getStates() {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT * FROM estados`
    );
    return rows
}

export async function getShirtSizes() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tallas_camiseta');
    return rows
}

export async function totalRegistrados(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_registrados from registros where evento_id = ?;', [2]);
    return rows[0].total_registrados
}

export async function totalCheckin(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_checkin from registros where checkin_at is not null and evento_id = ?;', [2]);
    return rows[0].total_checkin
}

export async function totalCamisaPagada(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_camisa_pagada from registros where incluir_camisa = ? and pago_camiseta = ? and evento_id = ? ;',
        [1, "pagado", 2]);
    return rows[0].total_camisa_pagada
}

export async function totalLunchPagada(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_lunchtime_pagado from registros where incluir_lunchtime = ? and pago_lunchtime = ? and evento_id = ?;',
        [1, 'pagado', 2]);
    return rows[0].total_lunchtime_pagado
}


