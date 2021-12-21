import useSWR from "swr";
import {ProductType} from "../pages/api/products";
import {useMemo} from "react";
import {nanoid} from "nanoid";


const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const useProducts = () => {
  const {data, error} = useSWR<ProductType[]>('/api/products', fetcher);

  const products = useMemo(() => {
    if (!data) return undefined;
    return data
      .map(e => e.node)
      .map((e) => ({
        id: nanoid(),
        name: e.name,
        imageUrl: 'https:' + e.thumbnailImage.file.url,
        tags: e.categoryTags,
        color: e.colorFamily,
        price: e.shopifyProductEu.variants.edges[0].node.price,
      }));
  }, [data]);

  return {
    products,
    error,
  }
}

const mergeArray = <T, B>(arr1: T[], arr2: B[]) : (T | B)[] => [...arr1, ...arr2];
const isNotEmpty = <T>(data?: T | undefined | null | '' | 0): data is T => Boolean(data);
const select = <T extends Record<any, any>, K extends keyof T>(key: K) => (data: T) => data[key];
const unique = <T>(e: T, i: number, arr: T[]) => arr.indexOf(e) === i;

export const useAvailableFilters = () => {
  const {products, error} = useProducts();

  const tags = useMemo(() => {
    if (!products) return undefined;
    return products.map(select('tags')).filter(isNotEmpty).reduce(mergeArray).filter(unique);
  }, [products]);

  const colors = useMemo(() => {
    if (!products) return undefined;
    return products.map(select('color')).filter(isNotEmpty).map(color => color[0]).map(select('name')).filter(unique);
  }, [products]);

  return {
    data: tags && colors && {
      tags,
      colors,
    },
    error,
  }
}