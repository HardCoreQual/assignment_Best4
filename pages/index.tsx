import type {NextPage} from 'next'
import React from "react";
import {Products} from "../components/products";
import {FilterFormProvider} from "../components/filterForm";
import {FilterContextProvider} from "../context/filterContext";

const Home: NextPage = () => {
  return <FilterContextProvider>
    <FilterFormProvider />
    <Products />
  </FilterContextProvider>
}

export default Home
