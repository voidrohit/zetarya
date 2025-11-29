// Next.js API route for storing/fetching SDP answers
import type { NextApiRequest, NextApiResponse } from 'next'

type AnswerStore = { [roomId: string]: any }
const answers: AnswerStore = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomId } = req.query as { roomId: string }

    if (req.method === 'POST') {
        answers[roomId] = req.body.answer
        return res.status(200).json({ ok: true })
    }

    if (req.method === 'GET') {
        const answer = answers[roomId]
        return res.status(200).json({ answer })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
