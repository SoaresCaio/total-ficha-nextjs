import admin from 'firebase-admin'
import { NextResponse } from 'next/server'

// initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}
const db = admin.firestore()

export async function GET(request, { params }) {
  // await params for Next.js dynamic API routes
  const { code } = await params
  const doc = await db.collection('workouts').doc(code).get()
  if (!doc.exists) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
  }
  return NextResponse.json(doc.data())
}

export async function DELETE(request, { params }) {
  // await params for Next.js dynamic API routes
  const { code } = await params
  try {
    await db.collection('workouts').doc(code).delete()
    return NextResponse.json(
      { message: `Usuário '${code}' deletado com sucesso` }
    )
  } catch (err) {
    console.error('Error deleting user:', err)
    return NextResponse.json(
      { error: 'Falha ao deletar usuário' },
      { status: 500 }
    )
  }
}
