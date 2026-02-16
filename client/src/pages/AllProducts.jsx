import React from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
  const { products, searchQuery } = useAppContext()

  const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : ''

  const filteredProducts = (products || []).filter((product) => {
    const name = product.name ? product.name.toLowerCase() : ''
    const matchesSearch = name.includes(query)
    return matchesSearch && product.inStock
  })

  return (
    <div className='mt-16 flex flex-col container mx-auto px-4 md:px-0'>
      <div className='flex flex-col items-start mb-6'>
        <p className='text-2xl font-medium uppercase'>All products</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 pb-8'>
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className='text-center py-20 text-gray-500'>
          No products found.
        </div>
      )}
    </div>
  )
}

export default AllProducts