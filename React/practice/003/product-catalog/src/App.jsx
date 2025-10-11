import { useState,useEffect } from 'react'
import './App.css'

function App() {

  const [products,setProducts] = useState([])
  const [filteredProducts,setFilteredProducts] = useState(products)
  const [search,setSearch] = useState("All")
  const [categories,setCategories] = useState([])
  const [selectedCategory,setSelectedCategory] = useState("All")
  const [sort,setSort] = useState("asc")
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
      setCategories('All',...uniqueCategories)
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

  
  return (
    <>
    <h1>Product Catalog</h1>
     {/* 判断是否加载中 */}
    {isLoading && <p>Loading products...</p>}
    {errorMessage && <p>Error: {errorMessage}</p>}
    {filteredProducts.length ===0 && <p>No products found</p>}
    {filteredProducts.length > 0 && 
    <div>
      {/* 遍历products */}
      {filteredProducts.map
      (item =>
          (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>{item.price}</p>
            </div>
          )
      )}
    </div>
    }
    </>
  )
}

export default App
