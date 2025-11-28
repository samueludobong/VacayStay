import React from 'react'

const AboutUsEro = () => {
  return (
    <main class="flex flex-col max-md:gap-20 md:flex-row pb-20 items-center justify-between mt-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <div class="flex flex-col items-center md:items-start">
            <h1 class="text-center md:text-left text-4xl leading-[46px] md:text-5xl md:leading-[68px] font-semibold max-w-xl text-slate-900">
                AI-powered 
                <br />
                influencer marketing made simple.
            </h1>
            <p class="text-center md:text-left text-sm text-slate-700 max-w-lg mt-2">
                Unlock smarter workflows with AI tools designed to boost productivity, simplify tasks and help you do more with less effort.
            </p>
            <div class="flex items-center gap-4 mt-8 text-sm">
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition rounded-md px-7 h-11">
                    Get started
                </button>
                <button class="flex items-center gap-2 border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-md px-6 h-11">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-icon lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                    <span>Watch demo</span>
                </button>
            </div>
        </div>
        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-5.png" alt="hero" class="max-w-sm sm:max-w-md lg:max-w-lg 2xl:max-w-xl transition-all duration-300" />
    </main>
  )
}

export default AboutUsEro