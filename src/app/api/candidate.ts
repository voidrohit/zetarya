// Next.js API route for exchanging ICE candidates
import type { NextApiRequest, NextApiResponse } from 'next'

type CandStore = { [roomId: string]: { offer: RTCIceCandidateInit[]; answer: RTCIceCandidateInit[] } }
const candidates: CandStore = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomId, role } = req.query as { roomId: string; role: 'offer' | 'answer' }

    if (!candidates[roomId]) candidates[roomId] = { offer: [], answer: [] }

    if (req.method === 'POST') {
        const arr = candidates[roomId][role]
        arr.push(req.body.candidate)
        return res.status(200).json({ ok: true })
    }

    if (req.method === 'GET') {
        const arr = candidates[roomId][role]
        candidates[roomId][role] = []  // once fetched, clear queue
        return res.status(200).json({ candidates: arr })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
