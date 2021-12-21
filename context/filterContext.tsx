import React, {useState} from "react";
import {useProducts} from "../hooks/products";

export type Selected = Record<string, boolean | undefined>;
type SetSelected = (e: Selected | ((s: Selected) => Selected)) => void;

export const FilterContext = React.createContext<{
    selectedTags: Selected,
    setSelectedTags: SetSelected,
    selectedColors: Selected,
    setSelectedColors: SetSelected,
  }
  | null>(null);

export const FilterContextProvider: React.FC = ({children}) => {
  const {products, error} = useProducts();
  const [selectedTags, setSelectedTags] = useState<Selected>({});
  const [selectedColors, setSelectedColors] = useState<Selected>({});

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
  }}>
    {children}
  </FilterContext.Provider>
}