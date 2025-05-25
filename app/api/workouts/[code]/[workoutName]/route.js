// app/api/workouts/[code]/[workoutName]/route.js

import admin from 'firebase-admin'
import { NextResponse } from 'next/server'

// Decode your Base64‐encoded service account JSON
const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    'base64'
  ).toString('utf8')
)

// Initialize Firebase Admin exactly once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}
const db = admin.firestore()

export async function DELETE(request, { params }) {
  // await params for Next.js dynamic API routes
  const { code, workoutName } = await params

  try {
    const docRef = db.collection('workouts').doc(code)
    // Delete just that workout inside the document
    await docRef.update({
      [`workouts.${workoutName}`]: admin.firestore.FieldValue.delete(),
    })
    return NextResponse.json(
      { message: `Treino '${workoutName}' deletado com sucesso` }
    )
  } catch (err) {
    console.error('🔥 DELETE /api/workouts/[code]/[workoutName] error:', err)
    return NextResponse.json(
      { error: 'Falha ao deletar treino' },
      { status: 500 }
    )
  }
}
