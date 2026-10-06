import Header from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import Footer from './components/Footer.tsx'

function App() {
  /*
   * svh, not vh: mobile browser chrome makes 100vh overflow. flex-col + flex-1
   * on main is what pins the footer to the viewport bottom while this page is
   * still shorter than the screen — otherwise it just hangs in the middle.
   */
  return (
    <div className="flex min-h-svh flex-col bg-base text-ink">
      <Header />
      <Hero />

      <main className="flex-1">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight">Next section</h2>
          <p className="mt-4 max-w-prose text-base text-ink-2">
            Placeholder body copy so the sticky header has something to sit
            above.
          </p>
          <div className="mt-16 h-200" aria-hidden="true" />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App