interface WestBengalOutlineProps {
  className?: string;
}

/**
 * A deliberately simplified, stylized silhouette of West Bengal's general
 * shape — narrow north (the Siliguri corridor/Darjeeling area), widening
 * through the central Gangetic plain, tapering toward the southern
 * delta/coast. This is NOT traced from precise geographic boundary data:
 * this environment's tools couldn't reach raw SVG/GeoJSON boundary files
 * (web_fetch can't retrieve Wikimedia Commons' actual source files, and
 * the code sandbox has no network access to download and inspect one
 * directly). Built from general knowledge of the state's distinctive
 * silhouette instead, and simplified further for a decorative watermark
 * — which is also what was actually asked for ("never look like a
 * traditional map," 5–12% opacity). Flagged here and in chat rather than
 * presented as more precise than it is.
 */
export function WestBengalOutline({ className }: WestBengalOutlineProps) {
  return (
    <svg viewBox="0 0 200 320" fill="none" className={className} aria-hidden="true">
      <path
        d="M 96 4
           C 104 4 110 10 112 18
           C 114 26 110 34 116 40
           C 124 48 138 46 146 56
           C 154 66 150 78 156 90
           C 162 102 174 106 178 120
           C 182 136 172 146 174 160
           C 176 176 168 184 166 198
           C 164 212 170 222 164 234
           C 158 246 144 248 138 258
           C 132 268 134 280 124 288
           C 116 294 106 290 100 298
           C 94 306 92 314 84 316
           C 76 318 70 310 66 300
           C 62 290 66 280 58 272
           C 50 264 38 266 32 256
           C 26 246 34 236 28 226
           C 22 216 10 214 8 202
           C 6 190 16 182 16 170
           C 16 158 6 152 8 140
           C 10 128 22 124 26 112
           C 30 100 24 90 32 80
           C 40 70 54 72 62 64
           C 70 56 68 46 76 36
           C 84 26 82 16 88 10
           C 91 6 93 4 96 4 Z"
        fill="currentColor"
      />
    </svg>
  );
}
