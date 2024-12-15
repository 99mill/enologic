import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const vendors = await prisma.vendor.findMany()
  return NextResponse.json(vendors)
}

export async function POST(request: Request) {
  const body = await request.json()
  const vendor = await prisma.vendor.create({
    data: body,
  })
  return NextResponse.json(vendor)
}

