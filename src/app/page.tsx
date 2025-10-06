'use client'

import HeroVanishInput from '@/components/HeroVanishInput'
import { motion } from 'motion/react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-800 mb-8">
              Pravay
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto">
              Where purpose begins.
            </p>
            <HeroVanishInput />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#how-it-works" className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors">
                Start Now
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Arrow */}
        <motion.a
          href="#how-it-works"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.a>
      </section>

      {/* The Problem Section */}
      <section id="how-it-works" className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-8"
            >
              Name 3 things you&apos;re really good at.
            </motion.h2>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6"
            >
              Can&apos;t answer? Neither could I.
            </motion.p>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              I was ok at lots of things, but never known for anything specific. I&apos;d start projects fired up, then lose interest after a while. 
              Couldn&apos;t stick with anything. I was just drifting through life with nothing to aim for.
            </motion.p>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed mt-4"
            >
              But deep down, I wanted something to be known for. Something people wouldn&apos;t mess with me on.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Why We Built This Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-16 text-center"
          >
            This shouldn&apos;t be this hard.
          </motion.h2>
          
          <div className="space-y-8 text-left max-w-3xl mx-auto">
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              When I finally decided to change something, I went online looking for help. Found nothing useful. Just outdated personality tests or stuff that took forever.
            </motion.p>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              So I tried ChatGPT. Spent hours going back and forth, correcting it. Eventually found something I could work with.
            </motion.p>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              This could&apos;ve been way easier. AI should just have a real conversation with you and guide you through finding your passion.
            </motion.p>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed"
            >
              So I built Pravay for everyone like me who doesn&apos;t know what to do and just wants something they actually burn for.
            </motion.p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            >
              How it works
            </motion.h2>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              3 steps. 3 minutes. Start taking action.
            </motion.p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <motion.div 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Have a real conversation
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Talk to AI that actually guides you. No guessing. Just answer honestly and let it lead you to what matters.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Get your top 3 passions
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Based on your conversation, discover 3 specific passion areas that actually fit you—not generic career labels.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  Take action with a real plan
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Get an actionable plan to test which passion is actually yours and how to get started. Because knowing is useless without action.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              See it in action
            </h2>
          </div>
          {/* Video */}
          <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              controls
              preload="metadata"
            >
              <source src="/actual.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            You owe it to yourself.
          </motion.h2>
          <motion.p 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
          >
            Stop wasting time on things that don&apos;t matter. Find what you actually burn for. It only takes 3 minutes.
          </motion.p>
          <motion.a 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="/signup" 
            className="bg-white text-gray-900 px-12 py-5 rounded-lg text-xl font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Now
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Pravay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
