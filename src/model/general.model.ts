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
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_registrados from registros where evento_id = ?;', [eventId]);
    return rows[0].total_registrados
}

export async function totalCheckin(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_checkin from registros where checkin_at is not null and evento_id = ?;', [eventId]);
    return rows[0].total_checkin
}

export async function totalCamisaPagada(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_camisa_pagada from registros where incluir_camisa = ? and pago_camiseta = ? and evento_id = ? ;',
        [1, "pagado", eventId]);
    return rows[0].total_camisa_pagada
}

export async function totalLunchPagada(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>('select count(id) as total_lunchtime_pagado from registros where incluir_lunchtime = ? and pago_lunchtime = ? and evento_id = ?;',
        [1, 'pagado', eventId]);
    return rows[0].total_lunchtime_pagado
}

export async function weeklyRegistrations(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT 
            YEARWEEK(created_at, 1) AS año_y_semana, 
            WEEK(created_at, 1) AS numero_semana,
            MIN(DATE(created_at)) AS fecha_inicio_semana, 
            COUNT(id) AS inscripciones 
        FROM 
            registros 
        WHERE 
            evento_id = ? 
        GROUP BY 
            YEARWEEK(created_at, 1), 
            WEEK(created_at, 1) 
        ORDER BY 
            año_y_semana ASC;
        `,
        [eventId]);
    return rows
}

export async function registersForMonthAndGender(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT 
                YEAR(created_at) AS anio,
                MONTH(created_at) AS numero_mes,
                DATE_FORMAT(created_at, '%b') AS mes_nombre,
                SUM(CASE WHEN genero = 'Masculino' THEN 1 ELSE 0 END) AS total_hombres,
                SUM(CASE WHEN genero = 'Femenino' THEN 1 ELSE 0 END) AS total_mujeres
            FROM 
                registros
            WHERE 
                evento_id = ?
            GROUP BY 
                YEAR(created_at),
                MONTH(created_at),
                DATE_FORMAT(created_at, '%b') 
            ORDER BY 
                anio ASC, 
                numero_mes ASC;
        `,
        [eventId]);
    return rows
}


export async function registersSizes(eventId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
       SELECT 
            t.talla AS talla,
            COUNT(r.id) AS cantidad
        FROM 
            registros r
        INNER JOIN tallas_camiseta t on r.talla_camiseta_id = t.id
        WHERE 
            r.evento_id = ? 
            AND r.incluir_camisa = 1 
            AND r.talla_camiseta_id IS NOT NULL 
            AND r.talla_camiseta_id != ''
        GROUP BY 
            r.talla_camiseta_id
        ORDER BY 
            cantidad DESC;
        `,
        [eventId]);
    return rows
}



