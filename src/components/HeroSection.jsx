import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight } from 'lucide-react';
import AimBoard from './AimBoard';
import ExamSelectionModal from './ExamSelectionModal';
import FocusConfigModal from './FocusConfigModal';
import { useState } from 'react';
import { Zap } from 'lucide-react';

const HeroSection = () => {
    const { theme, currentTheme } = useTheme();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

    // Particle System Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 250;
        const mouseSafetyRadius = 250;

        let mouse = { x: null, y: null };

        const resizeCanvas = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.offsetWidth;
                canvas.height = containerRef.current.offsetHeight;
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Theme Colors configuration
        const getThemeColors = () => {
            switch (currentTheme) {
                case 'neon': return { fill: 'rgba(34, 211, 238, 0.5)', stroke: 'rgba(168, 85, 247, 0.2)', highlight: '#22d3ee' };
                case 'matrix': return { fill: 'rgba(16, 185, 129, 0.5)', stroke: 'rgba(16, 185, 129, 0.2)', highlight: '#10b981' };
                case 'light': return { fill: 'rgba(59, 130, 246, 0.5)', stroke: 'rgba(59, 130, 246, 0.1)', highlight: '#3b82f6' };
                case 'dark': return { fill: 'rgba(148, 163, 184, 0.5)', stroke: 'rgba(148, 163, 184, 0.1)', highlight: '#94a3b8' };
                default: return { fill: 'rgba(255, 255, 255, 0.5)', stroke: 'rgba(255, 255, 255, 0.1)', highlight: '#ffffff' };
            }
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseSafetyRadius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseSafetyRadius - distance) / mouseSafetyRadius;
                        // Gentle repulsion
                        if (distance < 100) {
                            this.vx -= forceDirectionX * force * 0.05;
                            this.vy -= forceDirectionY * force * 0.05;
                        }
                    }
                }
            }

            draw(colors) {
                ctx.fillStyle = colors.fill;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getThemeColors();

            particles.forEach(particle => {
                particle.update();
                particle.draw(colors);
            });

            // Draw connections
            particles.forEach((a, i) => {
                // Connect to other particles
                particles.slice(i + 1).forEach(b => {
                    let dx = a.x - b.x;
                    let dy = a.y - b.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.strokeStyle = colors.stroke;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });

                // Connect to mouse
                if (mouse.x != null) {
                    let dx = a.x - mouse.x;
                    let dy = a.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseSafetyRadius) {
                        ctx.strokeStyle = colors.highlight;
                        ctx.lineWidth = 0.5;
                        ctx.globalAlpha = (mouseSafetyRadius - distance) / mouseSafetyRadius; // Fade out
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('mousemove', handleMouseMove);
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousemove', handleMouseMove);
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [currentTheme]);

    return (
        <div ref={containerRef} className="relative pt-24 pb-12 overflow-hidden min-h-[600px] flex items-center">

            {/* Interactive Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none" />

            {/* Background Gradient Blob (Preserved for aesthetic depth) */}
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none ${theme.name === 'Neon' ? 'bg-cyan-500' :
                theme.name === 'Matrix' ? 'bg-emerald-500' :
                    theme.name === 'Light' ? 'bg-blue-300' : 'bg-blue-600'
                } -translate-y-1/2 translate-x-1/2`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Text Content */}
                    <div className="text-left space-y-8 select-none">
                        <h1 className={`text-6xl md:text-7xl font-bold leading-tight ${theme.text} tracking-tight`}>
                            MASTER <br />
                            <span className={`text-transparent bg-clip-text ${theme.name === 'Neon' ? 'bg-gradient-to-r from-cyan-400 to-purple-400' :
                                theme.name === 'Matrix' ? 'bg-gradient-to-r from-emerald-400 to-green-600' :
                                    theme.name === 'Light' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
                                        'bg-gradient-to-r from-blue-400 to-indigo-400'
                                }`}>
                                CURRENT AFFAIRS
                            </span>
                        </h1>
                        <p className={`text-xl md:text-2xl ${theme.textMuted} max-w-lg`}>
                            The ultimate platform to boost your General Knowledge and ace Competitive Exams.
                        </p>

                        <div className={`flex flex-wrap gap-3 text-sm font-medium ${theme.textMuted} mb-4`}>
                            {['UPSC', 'SBI PO', 'IBPS', 'RBI Grade B', 'SSC', 'Railways'].map((exam) => (
                                <span key={exam} className={`px-3 py-1.5 rounded-full border ${theme.border} bg-white/5 backdrop-blur-sm hover:scale-105 transition-transform cursor-default`}>
                                    {exam}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className={`${theme.accent} ${theme.accentHover} text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all flex items-center group ring-2 ring-offset-2 ring-transparent hover:ring-white/20`}
                            >
                                START FREE QUIZ
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setIsFocusModalOpen(true)}
                                className={`px-8 py-4 rounded-full text-lg font-bold border ${theme.border} ${theme.text} hover:bg-white/10 backdrop-blur-sm transition-all flex items-center group`}
                            >
                                <Zap className="mr-2 w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                                ENTER FOCUS MODE
                            </button>
                        </div>
                    </div>

                    {/* Aim Board Visual - Adjusted Spacing/Border */}
                    <div className="relative flex justify-center items-center">
                        <div className="relative z-10">
                            <AimBoard />
                        </div>

                        {/* Subtle Glow behind the target */}
                        <div className={`absolute inset-0 blur-3xl opacity-20 ${theme.name === 'Neon' ? 'bg-cyan-500' :
                            theme.name === 'Matrix' ? 'bg-emerald-500' : 'bg-blue-500'
                            } rounded-full`}></div>
                    </div>

                </div>
            </div>

            <ExamSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <FocusConfigModal
                isOpen={isFocusModalOpen}
                onClose={() => setIsFocusModalOpen(false)}
            />
        </div>
    );
};

export default HeroSection;
