import useSWR from "swr";
import {OriginProductType} from "../pages/api/products";
import {useEffect, useMemo, useState} from "react";
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
const getSelected = (selected: Selected) => Object.entries(selected).filter(([,value]) => value).map(([key]) => key);

const moreThatMinPrice = (minPrice: number | null) => <T extends Record<'price', Product['price']>>(p: T) => !minPrice || minPrice <= p.price;
const lessThatMaxPrice = (maxPrice: number | null) => <T extends Record<'price', Product['price']>>(p: T) => !maxPrice || maxPrice >= p.price;

export const useFilteredProducts = () => {
  const { products, error } = useProducts();
  const { selectedColors, selectedTags, priceInterval } = useInitContext(FilterContext);

  const filteredProducts = useMemo(() => {
    if (!products) return undefined;
    return products
      .filter(moreThatMinPrice(priceInterval.min))
      .filter(lessThatMaxPrice(priceInterval.max))
      .filter(hasColor(getSelected(selectedColors)))
      .filter(hasTag(getSelected(selectedTags)));
  }, [ products, selectedTags, selectedColors, priceInterval ]);

  return {
    products: filteredProducts,
    error,
  }
}

export const useFilteredProductsWithPagination = () => {
  const [page, setPage] = useState(1);
  const { products, error } = useFilteredProducts();

  useEffect(() => {
    setPage(1);
  }, [products]);

  const data = useMemo(() => {
    const pageLimit = 24;
    return {
      countPages: Math.ceil((products?.length || 0) / pageLimit),
      products: products && products.slice((page - 1) * pageLimit, page * pageLimit),
    }
  }, [page, products]);

  return {
    error,
    page,
    setPage,
    ...data,
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