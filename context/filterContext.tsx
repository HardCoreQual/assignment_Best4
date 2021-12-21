import React, {useState} from "react";
import {useProducts} from "../hooks/products";

export type Selected = Record<string, boolean | undefined>;
type ChangeState<T> = React.Dispatch<React.SetStateAction<T>>;
type SetSelected = ChangeState<Selected>;

type PriceInterval = {
  min: number | null,
  max: number | null,
};

export const FilterContext = React.createContext<{
  selectedTags: Selected,
  setSelectedTags: SetSelected,
  selectedColors: Selected,
  setSelectedColors: SetSelected,
  priceInterval: PriceInterval,
  setPriceInterval: ChangeState<PriceInterval>,
}
  | null>(null);

export const FilterContextProvider: React.FC = ({children}) => {
  const {products, error} = useProducts();
  const [selectedTags, setSelectedTags] = useState<Selected>({});
  const [selectedColors, setSelectedColors] = useState<Selected>({});
  const [priceInterval, setPriceInterval] = useState<PriceInterval>({min: null, max: null});

  if (error) {
    return <div>Failed load products</div>
  }
  if (!products) {
    return <div>Loading...</div>
  }

  return <FilterContext.Provider value={{
    selectedColors,
    selectedTags,
    setSelectedColors,
    setSelectedTags,
    priceInterval,
    setPriceInterval
  }}>
    {children}
  </FilterContext.Provider>
}