import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const AimBoard = () => {
    const { currentTheme } = useTheme();

    const arrowRef = useRef(null);
    const lastPosRef = useRef({ x: 80, y: 200 });
    const animRef = useRef(null);

    const CENTER = { x: 200, y: 200 };
    const arrowLength = 100;
    const HIT_RADIUS = 140; // glow starts
    const HEAD_PENETRATION_OFFSET = arrowLength;

    const [isHit, setIsHit] = useState(false);

    // ===============================
    // Mouse Move
    // ===============================
    const handleMouseMove = (e) => {
        if (!arrowRef.current) return;

        cancelAnimationFrame(animRef.current);

        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        lastPosRef.current = { x: mx, y: my };

        const dx = CENTER.x - mx;
        const dy = CENTER.y - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        setIsHit(distance < HIT_RADIUS && distance > HEAD_PENETRATION_OFFSET);

        arrowRef.current.setAttribute(
            'transform',
            `translate(${mx}, ${my}) rotate(${angle})`
        );
    };

    // ===============================
    // Mouse Leave → Fly & Penetrate
    // ===============================
    const handleMouseLeave = () => {
        if (!arrowRef.current) return;

        cancelAnimationFrame(animRef.current);

        let { x, y } = lastPosRef.current;
        const speed = 6;

        const animate = () => {
            const dx = CENTER.x - x;
            const dy = CENTER.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Stop when HEAD reaches bullseye
            if (distance <= HEAD_PENETRATION_OFFSET) {
                lastPosRef.current = { x, y };
                setIsHit(false); // stop glow after penetration
                return;
            }

            const vx = (dx / distance) * speed;
            const vy = (dy / distance) * speed;

            x += vx;
            y += vy;

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            setIsHit(distance < HIT_RADIUS);

            arrowRef.current.setAttribute(
                'transform',
                `translate(${x}, ${y}) rotate(${angle})`
            );

            animRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    // ===============================
    // Theme Colors
    // ===============================
    const getColors = () => {
        switch (currentTheme) {
            case 'neon':
                return {
                    primary: '#22d3ee',
                    ring: 'rgba(34,211,238,0.15)',
                    bullseye: '#22d3ee',
                    glow: 'rgba(34,211,238,0.85)',
                };
            case 'matrix':
                return {
                    primary: '#10b981',
                    ring: 'rgba(16,185,129,0.15)',
                    bullseye: '#10b981',
                    glow: 'rgba(16,185,129,0.85)',
                };
            default:
                return {
                    primary: '#3b82f6',
                    ring: 'rgba(59,130,246,0.15)',
                    bullseye: '#3b82f6',
                    glow: 'rgba(59,130,246,0.85)',
                };
        }
    };

    const colors = getColors();

    return (
        <div
            className="relative w-[380px] h-[380px] md:w-[480px] md:h-[480px] flex items-center justify-center cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
                {/* Target Rings */}
                {[150, 110, 70, 35].map((r, i) => (
                    <circle
                        key={i}
                        cx={CENTER.x}
                        cy={CENTER.y}
                        r={r}
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth="2"
                    />
                ))}

                {/* Bullseye */}
                <circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r="18"
                    fill={colors.bullseye}
                    style={{
                        filter: isHit
                            ? `drop-shadow(0 0 10px ${colors.glow})`
                            : 'none',
                    }}
                />

                {/* Arrow */}
                <g ref={arrowRef}>
                    <line
                        x1="0"
                        y1="0"
                        x2={arrowLength}
                        y2="0"
                        stroke={colors.primary}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    <path
                        d={`M ${arrowLength + 14} 0 
                L ${arrowLength - 10} -12 
                L ${arrowLength - 10} 12 Z`}
                        fill={colors.primary}
                    />

                    <g>
                        <path
                            d="M -10 0 L 10 0"
                            stroke={colors.primary}
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                        <path
                            d="M -5 -12 L 10 0 L -5 12"
                            stroke={colors.primary}
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            d="M -15 -12 L 0 0 L -15 12"
                            stroke={colors.primary}
                            strokeWidth="4"
                            fill="none"
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default AimBoard;
