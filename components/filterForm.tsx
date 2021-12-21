import React from "react";
import {useAvailableFilters} from "../hooks/products";
import styled from "styled-components";
import {MultipleItemSelect} from "./multipleItemSelect";
import {useInitContext} from "../hooks/context";
import {FilterContext} from "../context/filterContext";
import {TextField} from "@mui/material";

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
  const { setSelectedColors, setSelectedTags, selectedColors, selectedTags, priceInterval, setPriceInterval } = useInitContext(FilterContext);

  return <div>
    <FromGroup>
      <Title>Category Tags</Title>
      <MultipleItemSelect items={tags} selectedItems={selectedTags} setSelectedItems={setSelectedTags}/>
    </FromGroup>

    <FromGroup>
      <Title>Colors</Title>
      <MultipleItemSelect items={colors} selectedItems={selectedColors} setSelectedItems={setSelectedColors}/>
    </FromGroup>

    <FromGroup>
      <Title>Price</Title>
      <InputNumber value={priceInterval.min} label="Min Price" onChange={(nr) => setPriceInterval((data) => ({...data, min: nr}))} />
      <InputNumber value={priceInterval.max} label="Max Price" onChange={(nr) => setPriceInterval((data) => ({...data, max: nr}))} />
    </FromGroup>
  </div>
}

const InputNumber: React.FC<{ value: number | null, onChange: (e: number | null) => void, label: string }> = ({onChange, label, value}) => {
  return <FieldContainer>
    <TextField onChange={(e) => {
      const nr = +e.target.value;
      onChange(Number.isNaN(nr) ? null : nr);
    }} value={value || ''} variant="outlined" label={label} size="small" fullWidth={true} />
  </FieldContainer>
}

const FieldContainer = styled.div`
  display: inline-block;
  margin: 0 5px;
  width: 300px;
`;

const FromGroup = styled.div`
  padding: 10px;
  user-select: none;
`;

const Title = styled.div`
  font-size: 18px;
  color: #888;
  font-weight: 500;
`
