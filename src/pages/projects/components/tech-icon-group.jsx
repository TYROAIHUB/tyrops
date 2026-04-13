import { useState, useRef } from "react"
import { Icon } from "@iconify/react"
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react"
import { getTechItem } from "@/data/tech-all"

function DataverseIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 2049.1001 1571.027" width={size} height={size} fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="m 2049.1,639 q 0,123 -29,239 -29,116 -83,220 -54,104 -131,191 -77,87 -174,149 -97,62 -211,98 -114,36 -242,35 -68,0 -136,-12 -68,-12 -132,-35 -64,-23 -123,-58 -59,-35 -109,-82 -22,38 -53,69 -31,31 -69,52 -38,21 -80,33 -42,12 -86,12 -78,0 -137,-29 -59,-29 -102,-77 -43,-48 -73,-111 -30,-63 -46,-132 -16,-69 -25,-138 -9,-69 -8,-132 0,-123 29,-239 29,-116 83,-220 54,-104 131,-190 77,-86 175,-149 98,-63 211,-98 113,-35 242,-35 67,0 135,11 68,11 132,35 64,24 123,59 59,35 109,81 22,-38 53,-69 31,-31 69,-52 38,-21 80,-33 42,-12 87,-12 78,0 137,28 59,28 102,77 43,49 73,112 30,63 46,132 16,69 24,138 8,69 8,132 z m -1658,783 q 74,0 119,-38 45,-38 78,-99 -62,-81 -95,-177 -33,-96 -33,-199 0,-95 31,-189 31,-94 90,-168 59,-74 142,-121 83,-47 186,-47 85,0 170,28 85,28 153,80 68,52 110,126 42,74 43,168 0,54 -15,106 -15,52 -48,96 34,-30 60,-68 26,-38 44,-80 18,-42 27,-87 9,-45 9,-91 0,-79 -23,-149 -23,-70 -64,-130 -41,-60 -97,-107 -56,-47 -122,-81 -66,-34 -139,-50 -73,-16 -148,-18 -110,0 -207,30 -97,30 -179,85 -82,55 -148,130 -66,75 -112,165 -46,90 -70,190 -24,100 -25,205 0,41 4,93 4,52 15,106 11,54 30,107 19,53 48,93 29,40 70,66 41,26 96,25 z m 1530,-784 q 0,-41 -4,-93 -4,-52 -15,-106 -11,-54 -30,-107 -19,-53 -48,-93 -29,-40 -69,-66 -40,-26 -96,-25 -74,0 -119,38 -45,38 -79,99 62,81 95,177 33,96 34,200 0,63 -14,126 -14,63 -42,122 -28,59 -66,109 -38,50 -90,87 -52,37 -110,59 -58,22 -128,21 -85,0 -170,-28 -85,-28 -153,-80 -68,-52 -110,-126 -42,-74 -43,-167 0,-55 17,-106 17,-51 46,-97 -34,30 -60,68 -26,38 -44,80 -18,42 -27,88 -9,46 -9,91 0,79 23,149 23,70 64,130 41,60 97,107 56,47 122,80 66,33 139,50 73,17 148,18 110,0 207,-30 97,-30 180,-85 83,-55 148,-130 65,-75 111,-164 46,-89 70,-190 24,-101 25,-206 z" />
    </svg>
  )
}

function TechIconContent({ item, size = 14 }) {
  if (item.imgUrl) return <img src={item.imgUrl} alt={item.label} width={size} height={size} className="object-contain" />
  if (item.icon === "__dataverse__") return <DataverseIcon size={size} />
  if (item.icon) return <Icon icon={item.icon} width={size} height={size} style={item.color ? { color: item.color } : {}} />
  return (
    <span className="text-[8px] font-bold text-white">
      {(item.abbr ?? item.label.slice(0, 2)).toUpperCase()}
    </span>
  )
}

export function TechIconGroup({ tech = [], max = 3 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const springConfig = { stiffness: 100, damping: 15 }
  const x = useMotionValue(0)
  const animationFrameRef = useRef(null)
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)

  if (!tech.length) return <span className="text-muted-foreground text-sm">—</span>

  const visible = tech.slice(0, max)
  const overflow = tech.length - max

  const handleMouseMove = (event) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2
      x.set(event.nativeEvent.offsetX - halfWidth)
    })
  }

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((val) => {
        const item = getTechItem(val)
        return (
          <div
            key={val}
            className="group relative -mr-0.5"
            onMouseEnter={() => setHoveredIndex(val)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === val && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 10 } }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{ translateX, rotate, whiteSpace: "nowrap" }}
                  className="absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-3 py-1.5 text-xs shadow-xl"
                >
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                  <div className="relative z-30 text-sm font-bold text-white">{item.label}</div>
                  {item.desc && <div className="text-[10px] text-white/70">{item.desc}</div>}
                </motion.div>
              )}
            </AnimatePresence>
            <div
              onMouseMove={handleMouseMove}
              className="h-6 w-6 rounded-full ring-2 ring-background flex items-center justify-center shrink-0 overflow-hidden cursor-pointer transition duration-500 group-hover:z-30 group-hover:scale-110"
              style={{ backgroundColor: item.bg, border: "1px solid #e5e7eb" }}
            >
              <TechIconContent item={item} />
            </div>
          </div>
        )
      })}
      {overflow > 0 && (
        <div className="h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  )
}
