import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone } = await req.json();

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
