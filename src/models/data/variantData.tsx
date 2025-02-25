import { IVariant } from '../interfaces/variant'

export const variantData: IVariant[] = [
  {
    id: 1,
    product: {
      id: 1,
      name: "Men's Polo Shirt Pique Cotton",
      category: {
        id: 2,
        name: 'Polo Shirt',
        referenceCategory: {
          id: 1,
          name: 'Shirt',
          referenceCategory: null,
          status: 1,
          slug: 'shirt',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-01-15T00:00:00Z'
        },
        status: 1,
        slug: 'mobile-phones',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z'
      },
      description: '<ul><li>hello</li><li>c&ocirc;&nbsp;</li><li>ba</li><li>s&agrave;i</li><li>g&ograve;n</li></ul>',
      thumbnail: 'http://localhost:5173/src/assets/images/product/shirt.webp',
      basePrice: 100000,
      slug: 'mens-polo-shirt-pique-cotton',
      view: 100,
      like: 100,
      status: 1,
      attributeType: [
        {
          id: 1,
          name: 'Color'
        },
        {
          id: 2,
          name: 'Size'
        }
      ],
      discount: {
        id: 1,
        name: '20% Off Summer Sale',
        discount: 20,
        expireDate: '2024-06-30T23:59:59Z',
        status: 1, // 1: Active
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      },
      updatedAt: '2023-01-15T00:00:00Z',
      createdAt: '2023-01-15T00:00:00Z'
    },
    thumbnail: 'http://localhost:5173/src/assets/images/product/shirt_blue.webp',
    price: 150000,
    status: 1,
    stock: 100,
    updatedAt: '2023-01-15T00:00:00Z',
    createdAt: '2023-01-15T00:00:00Z',
    variantAttributeValue: {
      color: {
        id: 2,
        name: 'Blue',
        value: '#0000FF'
      },
      size: {
        id: 4,
        name: 'M'
      }
    }
  }
]
