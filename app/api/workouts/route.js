import admin from 'firebase-admin'
import { NextResponse } from 'next/server'

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

export async function POST(request) {
  const { code, workoutName, exercises } = await request.json()
  if (!code || !workoutName || !exercises) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const docRef = db.collection('workouts').doc(code)
  const doc = await docRef.get()
  const existing = doc.exists ? doc.data().workouts || {} : {}
  existing[workoutName] = { exercises }
  await docRef.set({ workouts: existing })
  return NextResponse.json({ message: 'Workout saved successfully' })
}
