import { Hero } from '@/components/hero'
import { HomeCategoryRail } from '@/components/home/HomeCategoryRail'
import { HomeProductTabs } from '@/components/home/HomeProductTabs'
import { Categories } from '@/components/categories'

export default function HomePage() {
  return (
    <div className="flex flex-col bg-background">
      <Hero />
      <HomeProductTabs />
      <HomeCategoryRail />
      <Categories />
    </div>
  )
}
