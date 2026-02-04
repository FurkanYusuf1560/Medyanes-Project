import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    if (req.method === 'PUT') {
        const data = req.body;
        try {
            const updated = await prisma.todo.update({
                where: { id },
                data,
            });
            res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating todo' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.todo.delete({ where: { id } });
            res.status(200).json({ message: 'Todo deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting todo' });
        }
    } else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
