import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductCategories = () => {

    const {products} = useAppContext();
    const {category} = useParams();

    const searchCategories = categories.find((item)=> item.path.toLowerCase()=== category);

    const filterdProducts = products.filter((product)=> product.category.toLowerCase()===category);

  return (
      <div className='mt-16'>
        {searchCategories && (
            <div className='flex flex-col item-end w-max'> 
                <p>{searchCategories.text.toUpperCase()}</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'>

                </div>

            </div>
        )}

        {
            filterdProducts.length>0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                     {filterdProducts.map((product)=>{
                    return <ProductCard key={product._id} product={product}/>
                })} </div>

            ):( 
            <div className='flex items-center justify-center h-[60vh]'>
                <p className='text-2xl font-medium text-primary'>No products found in this category.</p>
            </div>
            )
        }

      </div>
  
  )
}

export default ProductCategories
