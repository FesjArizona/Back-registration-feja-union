import pool from '../conection/index';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function getConferences() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM conferencias');
    return rows
}

export async function getStates(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT e.id, e.nombre, e.codigo
        FROM estados e
        INNER JOIN conferencia_estado ce ON e.id = ce.estado_id
        WHERE ce.conferencia_id = ?`, [id]
    );
    return rows
}

export async function getShirtSizes() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tallas_camiseta');
    return rows
}
