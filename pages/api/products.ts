// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import miistaProducts from '../../data/miista-export.json';


export type ProductType = {
  node: {
    name: string,
    node_locale: string,
    thumbnailImage: {
      file: {
        url: string,
      }
    },
    colorFamily: [
      {
        name: string,
      }
    ],
    categoryTags: string[],
    shopifyProductEu: {
      variants: {
        edges: [
          {
            node: {
              price: string,
            }
          }
        ]
      }
    }
  }
};

const products = miistaProducts.data.allContentfulProductPage.edges as [];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductType[]>
) {
  res.status(200).json(products)
}
