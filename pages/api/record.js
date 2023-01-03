// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from '../../lib/db'
import Mint from '../../lib/mint'

export default async function handler(req, res) {
  await db()
  let to = req.query.to;
  let from = req.query.from;
  console.log(req.query)
  let mint = new Mint({ to: to, from: from });
  let dbres = await mint.save();
  res.status(200).json({ dbres })
}
