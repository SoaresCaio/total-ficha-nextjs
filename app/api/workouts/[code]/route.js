// app/api/workouts/[code]/route.js

import admin from 'firebase-admin'
import { NextResponse } from 'next/server'

// Decode your Base64 service account JSON
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64')
        .toString('utf8')
)

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}
const db = admin.firestore()

export async function GET(request, { params }) {
  const { code } = await params

  try {
    const doc = await db.collection('workouts').doc(code).get()
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(doc.data())
  } catch (err) {
    console.error('🔥 GET /api/workouts/[code] error:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { code } = await params

  try {
    await db.collection('workouts').doc(code).delete()
    return NextResponse.json(
      { message: `Usuário '${code}' deletado com sucesso` }
    )
  } catch (err) {
    console.error('🔥 DELETE /api/workouts/[code] error:', err)
    return NextResponse.json(
      { error: 'Falha ao deletar usuário' },
      { status: 500 }
    )
  }
}
