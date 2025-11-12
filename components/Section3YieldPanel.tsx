'use client';

import { useState, useEffect } from 'react';

interface YieldPanelProps {
    scrollProgress: number;
}

export default function Section3YieldPanel({ scrollProgress }: YieldPanelProps) {
    // Smooth transition from section 2 to section 3 (33% to 50% progress)
    const section2End = 0.33; // End of section 2
    const section3Start = 0.4; // Start of section 3
    const [isMounted, setIsMounted] = useState(false);

    // Ensure consistent hydration - only show after client-side mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything until mounted or before section 2 ends
    if (!isMounted || scrollProgress < section2End) return null;

    // Calculate smooth transition values
    const transitionRange = section3Start - section2End; // 0.07 range
    const transitionProgress = Math.min(1, Math.max(0, (scrollProgress - section2End) / transitionRange));
    
    // Smooth opacity and transform transitions
    const opacity = transitionProgress;
    const translateY = (1 - transitionProgress) * 30; // Start 30px below, move to 0
    const scale = 0.9 + (transitionProgress * 0.1); // Start at 90%, grow to 100%

    return (
        <div 
            className="absolute top-1/2 left-[63%] z-30 pointer-events-none max-w-2xl"
            style={{
                opacity: opacity,
                transform: `translateX(-50%) translateY(calc(-50% + ${translateY}px)) scale(${scale})`,
                transition: 'opacity 0.1s ease-out, transform 0.1s ease-out'
            }}
        >
            {/* Main Title */}
            <div className="text-white text-2xl md:text-3xl font-light italic mb-8 leading-tight"
                style={{ fontFamily: 'var(--font-aktiv)', fontWeight: '400', marginBottom: '2.5rem' }}>
                Begin accruing yield right away
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
                {/* Average APY */}
                <div className="flex justify-between items-center border-2 border-white/30 border-dotted rounded"
                    style={{ padding: '1.5rem' }}>
                    <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-[#ffd841] rounded-full mr-2"></div>
                        <span className="text-[#ffd841] text-xs uppercase font-light tracking-wide" style={{ fontFamily: 'var(--font-beltram)' }}>AVERAGE APY:</span>
                    </div>
                    <div className="text-white text-2xl font-bold italic" style={{ fontFamily: 'var(--font-beltram)' }}>4.4%</div>
                </div>

                {/* TVL */}
                <div className="flex justify-between items-center border-2 border-white/30 border-dotted rounded" 
                style={{ padding: '1.5rem' }}>
                    <div className="text-[#ffd841] text-xs uppercase font-light tracking-wide mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>TVL:</div>
                    <div className="text-white text-2xl font-bold italic" style={{ fontFamily: 'var(--font-beltram)' }}>$144.8M</div>
                </div>
            </div>

            {/* Main Info Panel */}
            <div className="border-2 border-white/30 border-dotted rounded p-6 space-y-6">
                {/* Perk #1 */}
                <div className="grid grid-cols-2 gap-1">
                    <div style={{ padding: '1rem' }} className=" border-r-2 border-white/30 border-dotted">
                        <div className="text-[#ffd841] text-xs uppercase font-light tracking-wide mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>PERK #1</div>
                        <div className="text-white text-xs font-light leading-relaxed" style={{ fontFamily: 'var(--font-beltram)' }}>
                            SPOT DOGE + SHORT PERP ON BINANCE VIA QUALIFIED CUSTODIAN.
                        </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <div className="text-[#ffd841] text-xs uppercase font-light tracking-wide mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>PROS:</div>
                        <div className="text-white text-xs font-light leading-relaxed" style={{ fontFamily: 'var(--font-beltram)' }}>
                            LARGE CAPACITY, STEADIER FUNDING.
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/20"></div>

                {/* Perk #2 */}
                <div className="grid grid-cols-2 gap-1">
                    <div style={{ padding: '1rem' }} className=" border-r-2 border-white/30 border-dotted">
                        <div className="text-[#ffd841] text-xs uppercase font-light tracking-wide mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>PERK #2</div>
                        <div className="text-white text-xs font-light leading-relaxed" style={{ fontFamily: 'var(--font-beltram)' }}>
                            EARN FUNDING/BASIS MINUS FEES.
                        </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <div className="text-[#ffd841] text-xs uppercase font-light tracking-wide mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>RISKS:</div>
                        <div className="text-white text-xs font-light leading-relaxed" style={{ fontFamily: 'var(--font-beltram)' }}>
                            EXCHANGE/COUNTERPARTY; FUNDING SQUEEZE.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
