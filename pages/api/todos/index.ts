import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const todos = await prisma.todo.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.status(200).json(todos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching todos' });
        }
    } else if (req.method === 'POST') {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        try {
            const todo = await prisma.todo.create({
                data: {
                    title,
                    description: description || '',
                    status: 'pending',
                },
            });
            res.status(201).json(todo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating todo' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
