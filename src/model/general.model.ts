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
