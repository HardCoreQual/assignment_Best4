import {useFilteredProducts} from "../hooks/products";
import React from "react";
import Image from "next/image";
import styled, {css} from "styled-components";

export const Products = () => {
  const {products, error} = useFilteredProducts();

  if (error) {
    return <div>Failed load products</div>
  }
  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <ProductGridContainer>
      {products.map(({name, imageUrl, id}) => {
        return <Product key={id} name={name} imageUrl={imageUrl}/>
      })}
    </ProductGridContainer>
  )
}

const ProductGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const Product: React.FC<{ name: string, imageUrl: string }> = ({imageUrl, name}) => {
  return <div>
    <Image src={imageUrl} alt="" width={200} height={200}/>
    <Name maxWidth={200}>{name}</Name>
  </div>
}

const Name: React.FC<{ maxWidth: number }> = (props) => {
  return <div>
    <InlineWithMaxWidth {...props} />
  </div>
}

const InlineWithMaxWidth = styled.div<{ maxWidth?: number }>`
  display: inline-block;
  ${props => props.maxWidth && css`max-width: ${props.maxWidth}px`}
`