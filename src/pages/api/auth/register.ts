// import { NextApiRequest, NextApiResponse } from "next";
// import { RegisterUser } from "~/utils/zodSchemas";
// import {z} from 'zod'
// import { prisma } from "~/server/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try{
//         if(req.method === "POST"){
//             const {name, email, password, image} = RegisterUser.parse(req.body)

//             const isUser = await prisma.user.count({
//                 where: {
//                     email
//                 }
//             })

//             if(isUser){
//                 res.status(403).send("User already exists")
//             }
//         }else{
//             res.status(200).json({ name: "John Doe" });
//         }
//     }catch(err:any){
//         if(err instanceof z.ZodError){
//             return res.status(422).send(err.message)
//         }
//         return res.status(500).send("Server error. Please try again later")
//     }
// }
