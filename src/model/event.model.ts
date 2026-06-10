import pool from '../conection/index';
import { ResultSetHeader, RowDataPacket } from 'mysql2';


export async function saveUserRegister() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * from conferencias');
    return rows
}