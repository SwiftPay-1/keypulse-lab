import { motion } from "framer-motion";

const bots = [
  { emoji: "🤖", x: "10%", y: "20%", delay: 0, size: "text-3xl md:text-4xl" },
  { emoji: "🧠", x: "85%", y: "15%", delay: 1, size: "text-2xl md:text-3xl" },
  { emoji: "⚡", x: "75%", y: "70%", delay: 2, size: "text-2xl md:text-3xl" },
  { emoji: "🔮", x: "15%", y: "75%", delay: 0.5, size: "text-xl md:text-2xl" },
  { emoji: "💻", x: "50%", y: "85%", delay: 1.5, size: "text-xl md:text-2xl" },
  { emoji: "🔑", x: "90%", y: "45%", delay: 3, size: "text-xl md:text-2xl" },
];

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {bots.map((bot, i) => (
        <motion.div
          key={i}
          className={`absolute ${bot.size} opacity-20`}
          style={{ left: bot.x, top: bot.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: bot.delay,
            ease: "easeInOut",
          }}
        >
          {bot.emoji}
        </motion.div>
      ))}
      
      {/* Circuit lines SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1920 1080">
        <path
          d="M0,200 L200,200 L200,400 L600,400 L600,100 L900,100"
          fill="none"
          stroke="hsl(263, 70%, 50%)"
          strokeWidth="1"
          strokeDasharray="10,5"
          className="animate-circuit"
        />
        <path
          d="M1920,300 L1700,300 L1700,600 L1400,600 L1400,200 L1100,200"
          fill="none"
          stroke="hsl(199, 89%, 48%)"
          strokeWidth="1"
          strokeDasharray="10,5"
          className="animate-circuit"
          style={{ animationDelay: "5s" }}
        />
        <path
          d="M400,1080 L400,800 L800,800 L800,500 L1200,500 L1200,900 L1600,900"
          fill="none"
          stroke="hsl(263, 70%, 50%)"
          strokeWidth="0.5"
          strokeDasharray="8,4"
          className="animate-circuit"
          style={{ animationDelay: "10s" }}
        />
      </svg>
    </div>
  );
}
