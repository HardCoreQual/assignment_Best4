import React from "react";
import styled from "styled-components";

export const MultipleItemSelect = <T extends string, S extends Record<T, boolean | undefined>>({items, selectedItems, setSelectedItems}: {
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
  background-color: ${props => props.active ? '#333' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
`