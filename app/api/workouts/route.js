// app/api/workouts/route.js

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

export async function POST(request) {
  try {
    const { code, workoutName, exercises } = await request.json()
    if (!code || !workoutName || !exercises) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    const docRef = db.collection('workouts').doc(code)
    const doc = await docRef.get()
    const existing = doc.exists ? doc.data().workouts || {} : {}
    existing[workoutName] = { exercises }
    await docRef.set({ workouts: existing })
    return NextResponse.json({ message: 'Workout saved successfully' })
  } catch (err) {
    console.error('🔥 POST /api/workouts error:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
