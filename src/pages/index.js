import Layout from '../components/Layout'
import Hero from '../components/Hero' 
import OurStory from '../components/OurStory'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import Menu from '../components/Menu'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <OurStory />
      <Services />
      <WhyChooseUs />
      <Menu />
    </Layout>
  )
}