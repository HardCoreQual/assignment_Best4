import React from "react";
import {useAvailableFilters} from "../hooks/products";
import styled from "styled-components";
import {MultipleItemSelect} from "./multipleItemSelect";
import {useInitContext} from "../hooks/context";
import {FilterContext} from "../context/filterContext";

export const FilterFormProvider = () => {
  const {data, error} = useAvailableFilters();

  if (error) {
    return <div>Failed load form</div>
  }
  if (!data) {
    return <div>Loading...</div>
  }

  return <FilterForm {...data} />;
}


const FilterForm: React.FC<{ tags: string[], colors: string[] }> = ({tags, colors}) => {
  const { setSelectedColors, setSelectedTags, selectedColors, selectedTags } = useInitContext(FilterContext);

  return <div>
    <ItemsContainer>
      <Title>Category Tags</Title>
      <MultipleItemSelect items={tags} selectedItems={selectedTags} setSelectedItems={setSelectedTags}/>
    </ItemsContainer>

    <ItemsContainer>
      <Title>Colors</Title>
      <MultipleItemSelect items={colors} selectedItems={selectedColors} setSelectedItems={setSelectedColors}/>
    </ItemsContainer>
  </div>
}

const ItemsContainer = styled.div`
  padding: 10px;
  user-select: none;
`;

const Title = styled.div`
  font-size: 18px;
  color: #888;
  font-weight: 500;
`
