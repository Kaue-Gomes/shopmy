import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Categories } from '@/components/categories'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedProducts />
      <Categories />
    </div>
  )
}
