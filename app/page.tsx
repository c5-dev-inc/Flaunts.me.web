import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Header */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Flaunts.me" 
            width={40} 
            height={40}
            className="rounded-xl"
          />
        </div>
        <a 
          href="https://c5-dev.com" 
          target="_blank"
          className="text-gray-300 hover:text-white transition"
        >
          C5-DEV
        </a>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="Flaunts.me" 
            width={80} 
            height={80}
            className="rounded-2xl mx-auto mb-6"
          />
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            flaunts.me
          </h1>
          <p className="text-xl text-purple-300 mb-3">
            Your link-in-bio page. Free. Forever.
          </p>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-10">
            Sign up in the C5-DEV app and claim your free flaunts.me page. Download now — it's free forever.
          </p>

          {/* Both App Store & Google Play buttons - ONLY HERE */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="https://apps.apple.com/app/c5-dev/id6760923929" 
              target="_blank"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.36 3 13.75 4.06 11.11c.52-1.33 1.45-2.43 2.55-3.06 1.1-.63 2.44-.85 3.74-.57.47.1.92.27 1.33.5.33.18.73.29 1.1.29.36 0 .74-.11 1.07-.28.58-.3 1.23-.46 1.88-.48.83-.02 1.63.19 2.33.58.71.39 1.3.96 1.76 1.65-1.47.89-2.2 2.53-1.85 4.1.32 1.44 1.54 2.62 3.06 2.95-.37 1.08-.86 2.07-1.42 2.95zM15.5 4.5c.66-.8 1.1-1.87 1.01-2.99-1.02.07-2.19.68-2.91 1.51-.64.74-1.07 1.74-.99 2.8 1.06.07 2.13-.57 2.89-1.32z"/>
              </svg>
              App Store
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.c5_dev.chat5" 
              target="_blank"
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.6 3.8c-.3.3-.5.7-.5 1.2v14c0 .5.2.9.5 1.2l.2.2L14.6 12 3.8 3.6l-.2.2zM16.5 9.8L4.9 3.1l.1-.1c.2-.1.4-.2.7-.2h9.5c.5 0 1 .2 1.4.5l-1.1 6.5zM21 11.5c-.3-.2-.6-.3-1-.3h-2.5l-1 6.2h2.5c.4 0 .7-.1 1-.3.5-.4.8-.9.8-1.5v-2.6c0-.6-.3-1.1-.8-1.5zM4.9 20.9c.2.1.4.2.7.2h9.5c.5 0 1-.2 1.4-.5l-1.1-6.5-12.4 7.2.1.1z"/>
              </svg>
              Google Play
            </a>
          </div>

          {/* Phone Mockup Preview */}
          <div className="max-w-xs mx-auto bg-gray-900 rounded-3xl p-3 border border-purple-800">
            <div className="bg-gradient-to-b from-purple-900 to-black rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <div>
                  <div className="h-3 w-20 bg-purple-400 rounded mb-1"></div>
                  <div className="h-2 w-24 bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 bg-purple-600 rounded-lg"></div>
                <div className="h-10 bg-purple-600/70 rounded-lg"></div>
                <div className="h-10 bg-purple-600/40 rounded-lg"></div>
              </div>
            </div>
            <p className="text-center text-gray-500 text-xs mt-3">flaunts.me/@yourname</p>
          </div>
        </div>

        {/* Features - Simple icons only */}
        <div className="flex justify-center gap-12 mt-20">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.102" />
              </svg>
            </div>
            <p className="text-gray-400 text-xs">Unlimited Links</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-xs">100% Free</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-xs">For Creators</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm pt-12 mt-12 border-t border-gray-800">
          <p>© 2026 flaunts.me — A C5-DEV product</p>
        </footer>
      </main>
    </div>
  );
}