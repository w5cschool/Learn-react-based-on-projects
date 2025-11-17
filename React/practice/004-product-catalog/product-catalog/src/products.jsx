import { useState,useEffect } from 'react'
import './App.css'
import Filters from './components/Filters'
import ProductCard from './components/ProductCard'

function Products() {

  const [products,setProducts] = useState([])
  const [filteredProducts,setFilteredProducts] = useState(products)
  const [search,setSearch] = useState("All")
  const [categories,setCategories] = useState([])
  const [selectedCategory,setSelectedCategory] = useState("All")
  const [sortOrder,setSortOrder] = useState("asc")
  const [isLoading,setIsLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState("")

  async function fetchProducts() {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      if(!response.ok){
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      console.log(data)
      setProducts(data)
      setFilteredProducts(data)
      const uniqueCategories = [...new Set(data.map(product => product.category))]
      setCategories(['All', ...uniqueCategories])
    } catch (error) {
      setErrorMessage(error.message)
    }finally{
      setIsLoading(false)
    }
  }

  // 第一次渲染的时候，调用fetchProducts
  useEffect(() =>{
    fetchProducts()
  },[])

  useEffect(() => {
    if(!products.length){
      setFilteredProducts([]);
      return;
    }

    let updated = [...products];
    if(selectedCategory !== 'All'){
      updated = updated.filter((products) => products.category === selectedCategory)
    }
    if(sortOrder === 'asc'){
      updated.sort((a,b) => a.price - b.price)
    }else if(sortOrder === 'desc'){
      updated.sort((a,b) => b.price - a.price)
    }
    setFilteredProducts(updated);
      },[products,selectedCategory,sortOrder]);

  
  return (
    <main className="catalog-page">
      <h1>Product Catalog</h1>
      {/* 筛选组件 */}
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder} 
      />
      {/* 判断是否加载中 */}
      {isLoading && <p>Loading products...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
      {filteredProducts.length ===0 && <p>No products found</p>}
      {filteredProducts.length > 0 && 
      <div className='products-grid'>
        {/* 遍历products */}
        {filteredProducts.map
        (item =>
            (
              <ProductCard key={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
                rating={item.rating}
                description={item.description}
              />
            )
        )}
      </div>
      }
    </main>
  )
}

export default Products
