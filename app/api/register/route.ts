import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in Neon Postgres via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the created user without the password
    return NextResponse.json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle Prisma unique constraint error for duplicate email
    if (error.code === 'P2002') {
       return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
