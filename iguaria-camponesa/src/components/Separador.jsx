export default function Separador({ bg = '#0D0905' }) {
  return (
    <div className="text-center leading-none py-1" style={{ background: bg }}>
      <svg
        viewBox="0 0 420 28"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className="w-full max-w-md mx-auto h-7"
      >
        <path
          d="M0,14 Q18,4 36,14 Q54,24 72,14 Q90,4 108,14 Q126,24 144,14 Q162,4 180,14 L193,14"
          stroke="#C8892A" strokeWidth="1" opacity="0.55"
        />
        <circle cx="200" cy="14" r="5"   fill="#C8892A" opacity="0.9" />
        <circle cx="188" cy="14" r="2.5" fill="#C8892A" opacity="0.45" />
        <circle cx="212" cy="14" r="2.5" fill="#C8892A" opacity="0.45" />
        <path
          d="M227,14 L240,14 Q258,4 276,14 Q294,24 312,14 Q330,4 348,14 Q366,24 384,14 Q402,4 420,14"
          stroke="#C8892A" strokeWidth="1" opacity="0.55"
        />
      </svg>
    </div>
  )
}
