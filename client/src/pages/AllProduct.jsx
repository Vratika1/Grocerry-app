import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import { useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';

const AllProduct = () => {

    const {products ,searchQuery} = useAppContext();
    const [filterdProducts, setFilterdProducts] = useState([]);

    useEffect(()=>{

        if(searchQuery.length>0){

            setFilterdProducts(products.filter(product=> product.name.toLowerCase().includes(searchQuery.toLowerCase())))
        }else{
            setFilterdProducts(products);
        }
    },[searchQuery,products])

  return (
     <div className="mt-16 px-4 sm:px-6 md:px-10">
    <div className="flex flex-col w-full">
      
      <p className="text-2xl font-medium uppercase">All Products</p>
      <div className="w-16 h-0.5 bg-primary rounded-full mb-6"></div>

      <div className="
        grid
        grid-cols-1
        min-[500px]:grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        gap-4
      ">
        {filterdProducts
          .filter(product => product.inStock)
          .map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>

    </div>
  </div>
  )
}

export default AllProduct
