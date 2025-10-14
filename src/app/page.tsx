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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-sky-500 mb-8">
              Pravay
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-4xl mx-auto">
              Where purpose begins.
            </p>
            <HeroVanishInput />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#how-it-works" className="bg-sky-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-sky-500 transition-colors">
                Start Now
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Arrow */}
        <motion.a
          href="#how-it-works"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-sky-500 transition-colors cursor-pointer"
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
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Stuck, unfulfilled, or drifting through life?
            </motion.h2>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              You&apos;re not alone. Here&apos;s what people tell us:
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Overwhelmed and stuck",
                description: "So many options, no skills, everything seems hard. You don&apos;t know where to start, so you do nothing.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Unfulfilled and drained",
                description: "You work a job that lost its spark or never had one. You want something that actually excites you when you wake up.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Start things, quit things",
                description: "Try something new, lose interest, repeat. Drifting through life hoping something will just click.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-300 to-sky-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-sky-300 to-sky-400 text-white mb-4 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                
                {/* Content */}
                <h3 className="relative text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="relative text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Have a real conversation with our AI
            </motion.h2>
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              No forms, no multiple choice. Our AI asks questions, listens to your answers, and adapts the conversation to help you discover your passion.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  number: "01",
                  title: "Talk about your situation",
                  description: "Natural back-and-forth conversation about where you are in life, what you're looking for, and what's holding you back."
                },
                {
                  number: "02",
                  title: "Explore what excites you",
                  description: "Answer questions that adapt to your responses. Dig into your values, strengths, and what naturally energizes you."
                },
                {
                  number: "03",
                  title: "Get 3 personalized matches",
                  description: "Receive specific passion areas based on everything you shared, not generic test results."
                },
                {
                  number: "04",
                  title: "Get complete action plans",
                  description: "Receive detailed roadmaps, 24 hour quick starts, success indicators, and curated resources. Everything you need to explore each passion."
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={false}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="text-5xl font-bold text-sky-200">{step.number}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-sky-500 to-sky-400 rounded-2xl p-12 text-white"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">What you get:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Situation & passion assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 personalized passion matches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>4-week testing roadmap for each passion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24-hour action plan to start immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Success indicators to know if it&apos;s right</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Curated resources and next steps</span>
                  </li>
                </ul>
                
                {/* Pricing */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$50</span>
                    <span className="text-xl opacity-90">USD</span>
                  </div>
                  <p className="mt-2 text-white/80 text-sm">One-time payment. Complete access to all features.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Built for real people with real lives
            </motion.h2>
            <motion.p
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              No endless courses. No vague advice. Just a practical path forward.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast",
                description: "Complete both assessments in under 30 minutes. Get your passion matches instantly.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              },
              {
                title: "Personalized",
                description: "Every plan is tailored to your time, energy, and constraints. No generic advice.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              },
              {
                title: "Actionable",
                description: "Clear next steps from day one. Know exactly what to do and when to do it.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              },
              {
                title: "Practical",
                description: "4-week testing cycles fit into your actual life. No need to quit your job or disappear.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              },
              {
                title: "Clear outcomes",
                description: "Know if you've found your passion or need to try the next one. No more wondering.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              },
              {
                title: "Multiple paths",
                description: "Get 3 passion matches. If one doesn't work, you have 2 more to explore.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                color: "from-sky-300 to-sky-400"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full -mr-16 -mt-16"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                stat: "No overthinking",
                description: "Just conversation and action",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                stat: "Proven process",
                description: "Test, learn, decide",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              {
                stat: "Multiple shots",
                description: "3 chances to find your fit",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-500 mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                
                {/* Stat */}
                <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-sky-500 transition-colors duration-300">
                  {item.stat}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-sky-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            You owe it to yourself
          </motion.h2>
          <motion.p 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Your passion is waiting. The only question is: are you ready to find it?
          </motion.p>
          <motion.a 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="/signup" 
            className="bg-white text-sky-500 px-12 py-4 rounded-lg text-xl font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Start Your Discovery
          </motion.a>
          <p className="mt-6 text-white text-sm opacity-90">Takes less than 15 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
              © 2025 Pravay. All rights reserved.
            </p>
            <a 
              href="/impressum" 
              className="text-gray-600 hover:text-sky-500 transition-colors text-sm"
            >
              Impressum
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
