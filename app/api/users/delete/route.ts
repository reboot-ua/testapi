import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
