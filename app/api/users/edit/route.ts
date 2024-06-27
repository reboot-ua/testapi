import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const { id, name, email, phone } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                phone,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
