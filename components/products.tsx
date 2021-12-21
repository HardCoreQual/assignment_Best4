import {useFilteredProductsWithPagination} from "../hooks/products";
import React from "react";
import Image from "next/image";
import styled, {css} from "styled-components";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Products = () => {
  const {products, error, countPages, setPage, page} = useFilteredProductsWithPagination();

  if (error) {
    return <div>Failed load products</div>
  }
  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ProductGridContainer>
        {products.map(({name, imageUrl, id}) => {
          return <Product key={id} name={name} imageUrl={imageUrl}/>
        })}
      </ProductGridContainer>

      <Stack spacing={2}>
        <Pagination
          count={countPages}
          page={page}
          onChange={(e, page) => setPage(page)}
          renderItem={(item) => (
            <PaginationItem
              components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </>
  )
}

const ProductGridContainer = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  @media(max-width: 1870px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media(max-width: 1400px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media(max-width: 900px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 500px) {
    grid-template-columns: 1fr;
  }
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