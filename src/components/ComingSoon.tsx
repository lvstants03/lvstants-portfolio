"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Construction, ArrowLeft, Hammer } from "lucide-react"

interface ComingSoonProps {
  title?: string
  description?: string
  backUrl?: string
}

export default function ComingSoon({ 
  title = "ĐANG PHÁT TRIỂN", 
  description = "Tính năng này đang được tôi xây dựng và hoàn thiện. Vui lòng quay lại sau nhé!",
  backUrl = "/"
}: ComingSoonProps) {
  return (
    // Thay đổi từ fixed/screen sang một container có giới hạn chiều cao và bo góc
    <div className="relative w-full max-w-5xl mx-auto min-h-[500px] md:min-h-[600px] flex items-center justify-center p-4 my-8 md:my-12 overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#080808]">
      
      {/* Background Decor - Giới hạn bên trong component */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Cảnh báo sọc công trường - Chỉ nằm ở top của component này */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,#eab308_0,#eab308_10px,#000_10px,#000_20px)] opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 flex flex-col items-center px-6 py-12 w-full"
      >
        <div className="relative mb-10">
          {/* Vòng xoay nét đứt */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-28 h-28 border-2 border-dashed border-yellow-500/30 rounded-full flex items-center justify-center"
          >
            <Construction className="w-10 h-10 text-yellow-500/20" />
          </motion.div>
          
          {/* Icon búa gõ */}
          <motion.div 
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] p-4 rounded-2xl border border-white/10 shadow-xl shadow-black"
          >
            <Hammer className="w-10 h-10 text-yellow-500" />
          </motion.div>
        </div>

        <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter text-white uppercase mb-6 leading-none">
          {title}
        </h2>
        
        <div className="w-20 h-1.5 bg-yellow-500 rounded-full mb-8" />
        
        <p className="text-zinc-400 max-w-lg mx-auto mb-12 text-sm md:text-lg leading-relaxed font-medium">
          {description}
        </p>

        <Link href={backUrl}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-500" />
            Quay lại trang chủ
          </motion.button>
        </Link>
      </motion.div>

      {/* Cảnh báo sọc công trường - Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(-45deg,#eab308_0,#eab308_10px,#000_10px,#000_20px)] opacity-50" />
    </div>
  )
}