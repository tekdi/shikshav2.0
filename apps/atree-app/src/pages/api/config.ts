// export const contentConfig ={
//     type:'Image',

// }
import { NextApiRequest, NextApiResponse } from 'next';

const contentConfig = {
  type: 'Image', // Can be "card" or "ImageList"
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(contentConfig);
}
