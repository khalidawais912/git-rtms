// // pages/api/v1/sapling.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { Client } from "@saplingai/sapling-js/client";

// const client = new Client(process.env.SAPLING_PRIVATE_KEY || "");

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { text } = req.body;

//     // provide a sessionId (can be userId, random UUID, or "default")
//     const sessionId = "default-session";

//     const response = await client.edits(text, sessionId);
//     res.status(200).json(response.data);
//   } catch (error: any) {
//     console.error("Sapling API error:", error);
//     res.status(500).json({ error: "Sapling request failed" });
//   }
// }
