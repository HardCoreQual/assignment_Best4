import type {NextPage} from 'next'
import React, {useState} from "react";
import {useAvailableFilters} from "../components/hook";
import {Products} from "../components/products";
import styled from "styled-components";


const FilterFormProvider = () => {
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
  const [selectedTags, setSelectedTags] = useState<Record<typeof tags[number], boolean | undefined>>({});
  const [selectedColors, setSelectedColors] = useState<Record<typeof colors[number], boolean | undefined>>({});

  return <div>
    <ItemsContainer>
      <Title>Category Tags</Title>
      <MultipleItemSelect items={tags} selectedItems={selectedTags} setSelectedItems={setSelectedTags} />
    </ItemsContainer>

    <ItemsContainer>
      <Title>Colors</Title>
      <MultipleItemSelect items={colors} selectedItems={selectedColors} setSelectedItems={setSelectedColors} />
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

const MultipleItemSelect = <T extends string, S extends Record<T, boolean | undefined>>({items, selectedItems, setSelectedItems}: {
  items: T[],
  selectedItems: S,
  setSelectedItems: (e: S | ((s: S) => S)) => void,
}) => {
  return <div>
    {items.map(item => {
      const active = Boolean(selectedItems[item]);
      return <Item
        key={item}
        active={active}
        onClick={() => setSelectedItems((items) => ({
          ...items,
          [item]: !active,
        }))}
      >
        {item}
      </Item>
    })}
  </div>
}

const Item = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 10px;
  margin: 2px;
  cursor: pointer;
  background-color: ${props => props.active ? '#333': '#fff'};
  color: ${props => props.active ? '#fff': '#333'};
`

const Home: NextPage = () => {
  return <div>
    <FilterFormProvider />
    <Products />
  </div>
}

export default Home
