import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AimBoard = () => {
    const { theme, currentTheme } = useTheme();
    const arrowRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!arrowRef.current) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        // Mouse Position relative to SVG origin (TopLeft)
        // This is our Target Tail Position
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Calculate Vector from Mouse(Tail) to Center(Target)
        const dx = 200 - mx;
        const dy = 200 - my;
        const angle = Math.atan2(dy, dx); // Angle pointing TO center

        const rotation = angle * (180 / Math.PI);

        // Update Arrow Transform
        // 1. Translate to Mouse Position (Tail)
        // 2. Rotate to face Center
        arrowRef.current.setAttribute(
            'transform',
            `translate(${mx}, ${my}) rotate(${rotation})`
        );
    };

    const resetArrow = () => {
        // Reset to a nice default position (e.g., slightly offset or centered)
        // Let's reset to "Hit position" -> Tail at 80, Head at 200. (Length 120 pointing Right)
        // Wait, default should be interesting.
        // Let's put tail at (80, 200) so it looks hit.
        if (arrowRef.current) {
            arrowRef.current.setAttribute('transform', `translate(80, 200) rotate(0)`);
        }
    };

    // Determine colors based on theme
    const getColors = () => {
        switch (currentTheme) {
            case 'neon':
                return {
                    primary: '#22d3ee', // Cyan
                    ring: 'rgba(34, 211, 238, 0.15)',
                    bullseye: '#22d3ee',
                };
            case 'matrix':
                return {
                    primary: '#10b981', // Emerald
                    ring: 'rgba(16, 185, 129, 0.15)',
                    bullseye: '#10b981',
                };
            default: // Light/Dark
                return {
                    primary: '#3b82f6', // Blue
                    ring: 'rgba(59, 130, 246, 0.15)',
                    bullseye: '#3b82f6',
                };
        }
    };

    const colors = getColors();
    const arrowLength = 140; // Fixed length for rigid feel

    return (
        <div
            className="relative w-[380px] h-[380px] md:w-[480px] md:h-[480px] flex items-center justify-center cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={resetArrow}
        >
            <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-2xl"
            >
                {/* Target Rings */}
                {[160, 120, 80, 40].map((r, i) => (
                    <circle
                        key={i}
                        cx="200"
                        cy="200"
                        r={r}
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth="2"
                        className="transition-colors duration-300"
                    />
                ))}

                {/* Bullseye */}
                <circle
                    cx="200"
                    cy="200"
                    r="18"
                    fill={colors.bullseye}
                    opacity="0.9"
                    className="transition-colors duration-300"
                />

                {/* RIGID ARROW GROUP */}
                {/* Initial State: Hit the bullseye from Left. Tail(80,200) -> Head(200,200) */}
                {/* Transform handles moving these local coords. */}
                {/* In Local Coords: Tail is (0,0). Head is (Length, 0). */}
                <g
                    ref={arrowRef}
                    className="transition-transform duration-75 ease-out"
                    transform="translate(80, 200) rotate(0)" // Matches rest state
                >
                    {/* SHAFT: (0,0) to (Length, 0) */}
                    <line
                        x1="0" y1="0"
                        x2={arrowLength} y2="0"
                        stroke={colors.primary}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />

                    {/* HEAD: At (Length, 0). Points in +X direction. */}
                    {/* Larger Head as requested */}
                    <path
                        d={`M ${arrowLength + 15} 0 L ${arrowLength - 10} -12 L ${arrowLength - 10} 12 Z`}
                        fill={colors.primary}
                        className="drop-shadow-lg"
                    />

                    {/* TAIL: At (0,0) */}
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M -15 -12 L 0 0 L -15 12"
                            stroke={colors.primary}
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default AimBoard;
