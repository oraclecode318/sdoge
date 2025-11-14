'use client';

import { useState, useEffect } from 'react';

interface StakePanelProps {
    scrollProgress: number;
}

export default function Section5StakePanel({ scrollProgress }: StakePanelProps) {
    // Smooth transition from section 4 to section 5 (67% to 83% progress)
    const section4End = 0.67; // End of section 4
    const section5Start = 0.74; // Start of section 5
    const [isMounted, setIsMounted] = useState(false);

    // Ensure consistent hydration - only show after client-side mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything until mounted or before section 4 ends
    if (!isMounted || scrollProgress < section4End) return null;

    // Calculate smooth transition values
    const transitionRange = section5Start - section4End; // 0.07 range
    const transitionProgress = Math.min(1, Math.max(0, (scrollProgress - section4End) / transitionRange));

    // Smooth opacity and transform transitions
    const opacity = transitionProgress;
    const translateY = (1 - transitionProgress) * 30; // Start 30px below, move to 0
    const scale = 0.9 + (transitionProgress * 0.1); // Start at 90%, grow to 100%

    return (
        <>
            {/* Stake and Earn Now Headline */}
            <div
                className="absolute z-30 pointer-events-none"
                style={{
                    top: '12%',
                    left: '50%',
                    transform: `translateX(-50%) scale(${scale})`,
                    opacity: opacity,
                    transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
                }}
            >
                <div
                    style={{
                        fontFamily: 'var(--font-aktiv)',
                        fontWeight: '800',
                        fontStyle: 'italic',
                        fontSize: '104px',
                        lineHeight: '100%',
                        letterSpacing: '-4.28px',
                        textAlign: 'center',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Stake and Earn Now
                </div>
            </div>

            {/* Image Container with Dotted Border */}
            <div
                className="absolute top-[57%] left-[50%] z-30 pointer-events-none"
                style={{
                    opacity: opacity,
                    transform: `translateX(-50%) translateY(calc(-50% + ${translateY}px)) scale(${scale})`,
                    transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
                }}
            >
                <div
                    className="border-2 border-white/30 border-dotted rounded p-4 mb-4"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2rem',
                    }}
                >
                    <img
                        src="/image/TOKEN_Op1_D3.0.png"
                        alt="Token"
                        style={{
                            width: 'auto',
                            height: '400px',
                            objectFit: 'contain',
                        }}
                    />
                </div>
                {/* COMING SOON Button */}
                <button
                    className="pointer-events-auto cursor-pointer w-full bg-[#ffd841] text-black py-4 px-12 rounded-xs hover:bg-[#ffd841]/90 transition-all duration-300 transform hover:scale-105"
                    style={{
                        fontFamily: 'var(--font-beltram)',
                        fontSize: '14px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}
                >
                    COMING SOON
                </button>
            </div>
        </>
    );
}


