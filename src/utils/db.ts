import postgres from 'postgres';

export const sql = postgres('postgres://username:password@host:port/database', {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});
