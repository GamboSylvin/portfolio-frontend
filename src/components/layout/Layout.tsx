import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="px-4 md:flex-1">{children}</main>
      <Footer />
    </div>
  )
}
