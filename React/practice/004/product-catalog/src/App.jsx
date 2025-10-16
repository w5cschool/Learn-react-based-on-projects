import { useState,useEffect } from 'react'
import './App.css'
import Filters from './components/Filters'
import ProductCard from './components/ProductCard'
import { Link,Route,Routes,Navigate } from 'react-router-dom'
import Products from './products'


function HomePage() {
  return (
    <section className='page'>
      <h1>Welcome to the Product Catalog</h1>
      <p>use the navigation to explore the products</p>
    </section>
  )
}

function ProductsPage() {
  return (
    <section className='page'>
      <Products />
    </section>
  )
}

function ProductDetailPage() {
  return (
    <section className='page'>
      <h1>Product Detail</h1>
      <p>View product details</p>
    </section>
  )
}

function CartPage() {
  return (
    <section className='page'>
      <h1>Cart</h1>
      <p>View your cart</p>
    </section>
  )
}

function App() {
  return (
    <div className='app-layout'>
      <header className='app-header'>
        <nav className='nav'>
          {/* Link:就是利用a标签的href属性，但是Link会自动添加active class，而a标签不会 */}
          <Link to='/'>Home</Link>
          <Link to='/products'>Products</Link>
          <Link to='/product/1'>Product 1</Link>
          <Link to='/cart'>Cart</Link>
        </nav>
      </header>
      <main className='app-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/product/:id' element={<ProductDetailPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </main>
    </div>
  )
}


export default App
