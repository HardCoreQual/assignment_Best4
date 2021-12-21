import useSWR from "swr";
import {OriginProductType} from "../pages/api/products";
import {useMemo} from "react";
import {nanoid} from "nanoid";
import {Product} from "../types/products";
import {useInitContext} from "./context";
import {FilterContext, Selected} from "../context/filterContext";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useProducts = () => {
  const {data, error} = useSWR<OriginProductType[]>('/api/products', fetcher);

  const products: Product[] | undefined = useMemo(() => {
    if (!data) return undefined;
    return data
      .map(e => e.node)
      .map((e) => ({
        id: nanoid(),
        name: e.name,
        imageUrl: 'https:' + e.thumbnailImage.file.url,
        tags: e.categoryTags,
        color: e.colorFamily,
        price: +e.shopifyProductEu.variants.edges[0].node.price,
      } as Product));
  }, [data]);

  return {
    products,
    error,
  }
}

const hasColor = (colors: string[]) => <T extends Record<'color', Product['color']>>(p: T) => !colors.length || (p.color?.length && colors.includes(p.color[0].name));
const hasTag = (tags: string[]) => <T extends Record<'tags', Product['tags']>>(p: T) => !tags.length || Boolean(tags.filter(t => p.tags?.includes(t)).length);
const getSelectedArr = (selected: Selected) => Object.entries(selected).filter(([,value]) => value).map(([key]) => key);

export const useFilteredProducts = () => {
  const { products, error } = useProducts();
  const { selectedColors, selectedTags } = useInitContext(FilterContext);

  const filteredProducts = useMemo(() => {
    if (!products) return undefined;
    return products
      .filter(hasColor(getSelectedArr(selectedColors)))
      .filter(hasTag(getSelectedArr(selectedTags)));
  }, [ products, selectedTags, selectedColors ]);

  return {
    products: filteredProducts,
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