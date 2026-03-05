"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "Step Into the 360° Immersive Chamber",
  "A Room That Becomes the World",
  "Projection. Sound. Atmosphere.",
  "Experience Without Headsets.",
];

const testimonials = [
  { id: 1, text: "It genuinely felt like I was standing in the middle of a dense rainforest. The spatial audio and wind effects were mind-blowing.", author: "Sarah Jenkins, Explorer" },
  { id: 2, text: "An incredible experience! My students could 'visit' Tokyo without ever leaving the city.", author: "Mark D., Educator" },
  { id: 3, text: "Affordable, stunning, and deeply immersive. TravolX is the future of accessible local tourism.", author: "Elena Rodriguez, Local Tourist" }
];

export default function Home() {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [testimonyIndex, setTestimonyIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force video playback on mount (Fixes Vercel/Production autoplay issues)
  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error: any) {
          // AbortError is common in low-power modes or if the video is paused/interrupted
          if (error.name !== "AbortError") {
            console.error("Autoplay was prevented:", error);
          }
        }
      };
      playVideo();
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Note: this is where we'd clear the form fields on success
    }, 2000);
  };

  // Typewriter Effect
  useEffect(() => {
    const current = phrases[phraseIndex];

    const typeEffect = () => {
      if (!isDeleting) {
        setDisplayText(current.substring(0, charIndex + 1));
        
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1400);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplayText(current.substring(0, charIndex - 1));
        
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setPhraseIndex((phraseIndex + 1) % phrases.length);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    };

    const delay = isDeleting ? 40 : 80;
    const timeout = setTimeout(typeEffect, charIndex + 1 === current.length && !isDeleting ? 0 : delay);
    
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  // Testimonial Carousel Auto-Play
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonyIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // changes every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Framer Motion Variants
  const fadeUpVariant: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <>
      <Head>
        <title>360 Immersive Chamber</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* ================= NAVBAR ================= */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/30 border-b border-sunsetOrange/30"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-sunsetOrange font-bold tracking-widest text-xl">
            TravolX
          </div>
          <div className="flex gap-8">
            <a href="#home" className="hover:text-goldenYellow transition">Home</a>
            <a href="#about" className="hover:text-goldenYellow transition">About</a>
            <a href="#features" className="hover:text-goldenYellow transition">Features</a>
            <a href="#contact" className="hover:text-goldenYellow transition">Contact</a>
          </div>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Video Placeholder */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/videos/hero_poster.jpg"
          preload="auto"
          id="vid" 
          className="absolute w-full h-full object-cover z-0"
        >
          <source src="/videos/hero_optimized.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay z-10"></div>

        {/* Portal Rings */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-[600px] h-[600px] border-4 border-sunsetOrange rounded-full portal-ring animate-spinSlow z-20"
        />
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute w-[400px] h-[400px] border-2 border-goldenYellow rounded-full portal-ring animate-spinSlow z-20"
        />

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-30 max-w-4xl px-6"
        >
          <motion.h1 
            variants={fadeUpVariant}
            className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-sunsetOrange via-goldenYellow to-softViolet bg-clip-text text-transparent min-h-[144px] md:min-h-[168px] flex items-center justify-center drop-shadow-[0_0_15px_rgba(255,170,51,0.4)]"
          >
            {displayText}
          </motion.h1>

          <motion.p 
            variants={fadeUpVariant}
            className="mt-8 text-lg text-gray-200"
          >
            A physical projection-mapped environment where walls transform into living global destinations.
            Spatial audio narration and environmental simulation like wind and atmospheric effects
            create a deeply immersive tourism experience — accessible and affordable to local communities.
          </motion.p>

          <motion.button 
            variants={fadeUpVariant}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-10 px-10 py-4 cursor-pointer bg-sunsetOrange text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,170,51,0.4)] transition-colors"
          >
            Enter the Experience
          </motion.button>
        </motion.div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="min-h-screen py-32 px-10 bg-black flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: About Text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            <h2 className="text-4xl font-bold text-goldenYellow mb-6">What We Actually Do</h2>
            <p className="text-lg leading-8 text-gray-300">
              We design and operate physical immersive projection chambers where 360° mapped environments
              transform every wall into a dynamic destination. Using high-resolution projection mapping,
              spatial surround narration, and environmental simulation such as wind and atmospheric effects,
              visitors experience realistic global locations without travel costs.
            </p>
          </motion.div>

          {/* Right: Testimonials Carousel */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="relative h-72 md:h-80 bg-deepDark border border-softViolet/30 p-8 rounded-3xl flex flex-col justify-center items-center shadow-[0_0_30px_rgba(166,127,240,0.15)] overflow-hidden"
          >
             <div className="absolute top-4 left-6 text-6xl text-softViolet/20 font-serif leading-none">"</div>
             
             <AnimatePresence mode="wait">
               <motion.div
                 key={testimonyIndex}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="text-center z-10 w-full px-12"
               >
                  <p className="text-lg md:text-xl italic text-gray-200 mb-6">
                    "{testimonials[testimonyIndex].text}"
                  </p>
                  <h4 className="text-sunsetOrange font-bold tracking-wide">
                    — {testimonials[testimonyIndex].author}
                  </h4>
               </motion.div>
             </AnimatePresence>

             {/* Navigation Arrows */}
             <button 
               onClick={() => setTestimonyIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
               className="absolute left-4 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-white/50 hover:text-sunsetOrange transition-colors z-20"
               aria-label="Previous testimonial"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
               </svg>
             </button>

             <button 
               onClick={() => setTestimonyIndex((prev) => (prev + 1) % testimonials.length)}
               className="absolute right-4 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-white/50 hover:text-sunsetOrange transition-colors z-20"
               aria-label="Next testimonial"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
               </svg>
             </button>

             {/* Navigation Dots */}
             <div className="absolute bottom-6 flex gap-3">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setTestimonyIndex(i)}
                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${i === testimonyIndex ? 'w-6 bg-softViolet' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
             </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="min-h-screen px-10 py-16 bg-deepDark flex flex-col justify-center items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto w-full"
        >
          <motion.h2 
            variants={fadeUpVariant}
            className="text-4xl font-bold text-softViolet mb-8 text-center"
          >
            Core Immersive Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              variants={fadeUpVariant}
              whileHover={{ y: -10 }}
              className="bg-black/50 border border-sunsetOrange rounded-2xl transition-colors overflow-hidden group"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/immersive_projection.png" 
                  alt="360 Projection Mapping" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-sunsetOrange mb-3">360° Projection Mapping</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Our core technology involves stitching ultra-high-resolution digital environments seamlessly across all four walls of our physical chambers. This erases the boundary of the room, fully engulfing you in expansive, photorealistic landscapes ranging from alien bioluminescent forests to the bustling streets of Tokyo. No headsets required.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeUpVariant}
              whileHover={{ y: -10 }}
              className="bg-black/50 border border-goldenYellow rounded-2xl transition-colors overflow-hidden group"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/spatial_audio.png" 
                  alt="Spatial Audio System" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-goldenYellow mb-3">Omnidirectional Audio</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Sight is only half the experience. We deploy a state-of-the-art 32-channel spatial audio array hidden seamlessly within the chamber walls and ceiling. Sound frequencies are mapped dynamically, meaning you can precisely locate the rustle of leaves behind you or the distant rumble of thunder echoing across the virtual valley.
                </p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeUpVariant}
              whileHover={{ y: -10 }}
              className="bg-black/50 border border-softViolet rounded-2xl transition-colors overflow-hidden group"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src="/images/environmental_effects.png" 
                  alt="Physical Environmental Effects" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-softViolet mb-3">Tactile Atmospherics</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Bridge the gap between digital and physical with synchronized environmental stimulation. As you step onto a virtual snowy peak, the room temperature drops and physical wind generators simulate the mountain breeze. Physical mist and fog effects roll across the real floor, directly syncing with the climate of your chosen destination.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="min-h-screen px-10 py-16 bg-black flex flex-col justify-center items-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="max-w-3xl mx-auto w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-sunsetOrange mb-2">Contact Us</h2>
            <p className="text-gray-300">
              Ready to book a session or partner with us? Reach out today.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-deepDark border border-sunsetOrange/20 p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(255,170,51,0.1)] flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-gray-400 font-medium ml-2 text-sm">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  placeholder="John Doe"
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-sunsetOrange transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-gray-400 font-medium ml-2 text-sm">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  placeholder="john@example.com"
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-sunsetOrange transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-gray-400 font-medium ml-2 text-sm">Subject</label>
              <input 
                type="text" 
                id="subject" 
                required
                placeholder="Booking Inquiry"
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-sunsetOrange transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-gray-400 font-medium ml-2 text-sm">Message</label>
              <textarea 
                id="message" 
                rows={3}
                required
                placeholder="Tell us what you're looking for..."
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-sunsetOrange transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 px-8 py-3 bg-gradient-to-r from-sunsetOrange to-goldenYellow text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,170,51,0.4)] transition-all duration-300 ${isSubmitting ? 'opacity-75 cursor-wait' : 'hover:shadow-[0_0_30px_rgba(255,170,51,0.6)] hover:scale-[1.02] cursor-pointer'}`}
            >
              {isSubmitting ? "Sending ..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-deepDark border-t border-goldenYellow/40 pt-20 pb-10 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-sunsetOrange mb-4 tracking-wider">TravolX</h3>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Transforming tourism through physical projection mapping and environmental simulation. The world is just one room away.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-gray-400 hover:text-goldenYellow transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-goldenYellow transition-colors">What We Do</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-goldenYellow transition-colors">Core Features</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#contact" className="text-gray-400 hover:text-goldenYellow transition-colors">Book a Session</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
          <p>© 2026 360 Immersion. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-sunsetOrange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-sunsetOrange transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
