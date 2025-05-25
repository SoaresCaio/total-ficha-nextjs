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

export async function DELETE(request, { params }) {
  const { code, workoutName } = params
  const docRef = db.collection('workouts').doc(code)
  const doc = await docRef.get()
  const existing = (doc.exists && doc.data().workouts) || {}
  if (!existing[workoutName]) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
  }
  await docRef.update({
    [`workouts.${workoutName}`]: admin.firestore.FieldValue.delete(),
  })
  return NextResponse.json({ message: 'Workout deleted successfully' })
}
