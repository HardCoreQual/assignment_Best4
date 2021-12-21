export type Product = {
  id: string,
  name: string,
  imageUrl: string,
  tags: string[] | null,
  color: [{ name: string }] | null,
  price: number,
}