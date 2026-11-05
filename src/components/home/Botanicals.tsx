import type { ReactNode } from 'react';
import styles from './Botanicals.module.css';

/*
 * Gold botanical line art that frames the homepage hero photo: lotus,
 * leaf sprigs and small five-petal flowers. Every shape is drawn here as
 * SVG paths (no image files), so it stays sharp at any size and its colour
 * comes from the tokens. Purely decorative: hidden from assistive tech.
 */

type Pt = [number, number];

const r = (n: number) => Math.round(n * 10) / 10;

/** A leaf pointing straight up from (0,0), with a midrib and side veins. */
function Leaf({ x, y, angle, length, width, veins = 3 }: {
    x: number; y: number; angle: number; length: number; width: number; veins?: number;
}) {
    const L = length;
    const w = width;
    const outline = `M0,0 C${r(w)},${r(-L * 0.22)} ${r(w * 0.92)},${r(-L * 0.72)} 0,${r(-L)} C${r(-w * 0.92)},${r(-L * 0.72)} ${r(-w)},${r(-L * 0.22)} 0,0 Z`;
    const midrib = `M0,0 Q${r(w * 0.12)},${r(-L * 0.5)} 0,${r(-L * 0.94)}`;
    const veinPaths: string[] = [];
    for (let i = 1; i <= veins; i++) {
        const t = 0.12 + (i / (veins + 1)) * 0.68;
        const y0 = -L * t;
        const y1 = -L * (t + 0.13);
        const reach = w * (0.78 - t * 0.35);
        veinPaths.push(`M0,${r(y0)} Q${r(reach * 0.5)},${r(y0 - L * 0.03)} ${r(reach)},${r(y1)}`);
        veinPaths.push(`M0,${r(y0)} Q${r(-reach * 0.5)},${r(y0 - L * 0.03)} ${r(-reach)},${r(y1)}`);
    }
    return (
        <g transform={`translate(${r(x)} ${r(y)}) rotate(${r(angle)})`}>
            <path className={styles.fill} d={outline} />
            <path className={styles.vein} d={midrib} />
            {veinPaths.map((d) => <path key={d} className={styles.vein} d={d} />)}
        </g>
    );
}

const bezier = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
];
const tangentDeg = (p0: Pt, p1: Pt, p2: Pt, t: number) => {
    const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
    const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
};

/** A curved stem with leaves alternating along it and one at the tip. */
function Sprig({ from, via, to, leaves, size, spread = 42 }: {
    from: Pt; via: Pt; to: Pt; leaves: number; size: number; spread?: number;
}) {
    const items = [];
    for (let i = 0; i < leaves; i++) {
        const t = 0.22 + (i / leaves) * 0.74;
        const [x, y] = bezier(from, via, to, t);
        const dir = tangentDeg(from, via, to, t) + 90;
        const side = i % 2 === 0 ? 1 : -1;
        const scale = 1 - t * 0.35;
        items.push(
            <Leaf key={i} x={x} y={y} angle={dir + side * spread} length={size * scale} width={size * scale * 0.36} veins={2} />,
        );
    }
    const tipDir = tangentDeg(from, via, to, 1) + 90;
    return (
        <g>
            <path className={styles.stem} d={`M${from[0]},${from[1]} Q${via[0]},${via[1]} ${to[0]},${to[1]}`} />
            {items}
            <Leaf x={to[0]} y={to[1]} angle={tipDir} length={size * 0.62} width={size * 0.2} veins={1} />
        </g>
    );
}

/** A lotus in side view: layered petals rising from a shallow bowl. */
function Lotus({ x, y, size }: { x: number; y: number; size: number }) {
    const petals: [number, number, number][] = [
        // angle, length, width (as fractions of size), back row first
        [-62, 0.62, 0.26], [62, 0.62, 0.26],
        [-38, 0.86, 0.3], [38, 0.86, 0.3],
        [-16, 1, 0.32], [16, 1, 0.32],
        [0, 1.08, 0.3],
    ];
    return (
        <g transform={`translate(${x} ${y})`}>
            {petals.map(([a, l, w]) => (
                <Leaf key={a} x={0} y={0} angle={a} length={size * l} width={size * w} veins={1} />
            ))}
            <path className={styles.fill} d={`M${-size * 0.62},${-size * 0.06} Q0,${size * 0.32} ${size * 0.62},${-size * 0.06} Q0,${size * 0.12} ${-size * 0.62},${-size * 0.06} Z`} />
            <path className={styles.vein} d={`M${-size * 0.9},${size * 0.2} Q${-size * 0.2},${size * 0.34} ${size * 0.9},${size * 0.2}`} />
            <path className={styles.vein} d={`M${-size * 0.6},${size * 0.34} Q0,${size * 0.42} ${size * 0.6},${size * 0.34}`} />
        </g>
    );
}

/** A five-petal flower seen from the front. */
function Flower({ x, y, size, turn = 0 }: { x: number; y: number; size: number; turn?: number }) {
    return (
        <g transform={`translate(${x} ${y}) rotate(${turn})`}>
            {[0, 72, 144, 216, 288].map((a) => (
                <Leaf key={a} x={0} y={0} angle={a} length={size} width={size * 0.5} veins={1} />
            ))}
            <circle className={styles.fill} r={size * 0.2} />
            {[0, 60, 120, 180, 240, 300].map((a) => (
                <circle
                    key={a}
                    className={styles.dot}
                    cx={r(Math.cos((a * Math.PI) / 180) * size * 0.1)}
                    cy={r(Math.sin((a * Math.PI) / 180) * size * 0.1)}
                    r={size * 0.03}
                />
            ))}
        </g>
    );
}

function Art({ className, viewBox, children }: { className: string; viewBox: string; children: ReactNode }) {
    return (
        <svg className={`${styles.art} ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">
            {children}
        </svg>
    );
}

export default function Botanicals() {
    return (
        <>
            {/* Top left: a lotus bud and a sprig leaning out over the arch. */}
            <Art className={styles.topLeft} viewBox="0 0 220 260">
                <Sprig from={[150, 250]} via={[70, 170]} to={[60, 30]} leaves={7} size={46} />
                <Sprig from={[150, 250]} via={[150, 160]} to={[200, 90]} leaves={4} size={34} spread={50} />
                <Lotus x={118} y={150} size={44} />
            </Art>

            {/* Bottom left: a full lotus with leaves at the foot of the photo. */}
            <Art className={styles.bottomLeft} viewBox="0 0 260 240">
                <Sprig from={[130, 236]} via={[40, 190]} to={[18, 70]} leaves={6} size={44} />
                <Leaf x={150} y={236} angle={58} length={92} width={30} />
                <Leaf x={120} y={236} angle={-28} length={84} width={28} />
                <Lotus x={140} y={190} size={70} />
            </Art>

            {/* Top right: two flowers and leaves on the arch's shoulder. */}
            <Art className={styles.topRight} viewBox="0 0 240 230">
                <Sprig from={[40, 220]} via={[110, 150]} to={[220, 140]} leaves={5} size={40} spread={48} />
                <Sprig from={[60, 210]} via={[90, 110]} to={[170, 30]} leaves={6} size={42} />
                <Flower x={120} y={86} size={34} turn={12} />
                <Flower x={196} y={150} size={24} turn={-20} />
            </Art>

            {/* Bottom right: broad leaves overlapping the corner of the photo. */}
            <Art className={styles.bottomRight} viewBox="0 0 220 260">
                <Leaf x={150} y={258} angle={-34} length={170} width={50} veins={4} />
                <Leaf x={160} y={258} angle={-6} length={200} width={56} veins={5} />
                <Leaf x={168} y={258} angle={26} length={150} width={46} veins={4} />
                <Sprig from={[110, 258]} via={[40, 220]} to={[20, 120]} leaves={4} size={40} />
            </Art>
        </>
    );
}
