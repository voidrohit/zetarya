// Next.js API route for storing/fetching SDP offers
import type { NextApiRequest, NextApiResponse } from 'next'

type OfferStore = { [roomId: string]: any }
const offers: OfferStore = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomId } = req.query as { roomId: string }

    if (req.method === 'POST') {
        offers[roomId] = req.body.offer
        return res.status(200).json({ ok: true })
    }

    if (req.method === 'GET') {
        const offer = offers[roomId]
        return res.status(200).json({ offer })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}
