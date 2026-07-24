const BUBBLES = [
  { size: 40, left: '5%',  delay: '0s',   duration: '8s'  },
  { size: 20, left: '15%', delay: '2s',   duration: '10s' },
  { size: 60, left: '25%', delay: '1s',   duration: '12s' },
  { size: 25, left: '38%', delay: '4s',   duration: '9s'  },
  { size: 50, left: '50%', delay: '0.5s', duration: '11s' },
  { size: 15, left: '62%', delay: '3s',   duration: '7s'  },
  { size: 35, left: '72%', delay: '1.5s', duration: '13s' },
  { size: 55, left: '82%', delay: '2.5s', duration: '10s' },
  { size: 20, left: '90%', delay: '0s',   duration: '8s'  },
  { size: 45, left: '95%', delay: '3.5s', duration: '11s' },
]

export default function Bubbles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  )
}
