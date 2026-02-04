
import { prisma } from '../../lib/prisma';

export default async function handler(req: any, res: any) {
    try {
        // Attempt connection
        await prisma.$connect();

        // Attempt query
        const count = await prisma.todo.count();

        // Get version
        let version = 'unknown';
        try {
            version = require('@prisma/client/package.json').version;
        } catch (e) { }

        res.status(200).json({
            status: 'Success',
            message: 'Database connection is working!',
            todoCount: count,
            prismaVersion: version
        });
    } catch (error: any) {
        let version = 'unknown';
        try {
            version = require('@prisma/client/package.json').version;
        } catch (e) { }

        res.status(500).json({
            status: 'Error',
            message: error.message,
            stack: error.stack,
            prismaVersion: version
        });
    }
}
