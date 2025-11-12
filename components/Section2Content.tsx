'use client';

import { FaRecycle, FaGhost } from 'react-icons/fa';
import { GiUfo } from 'react-icons/gi';

interface Section2CenterBoxProps {
    title: string;
}

function Section2CenterBox({ title }: Section2CenterBoxProps) {
    return (
        <div className="absolute top-1/2 left-1/4 transform -translate-x-2/3 -translate-y-2/3 z-30 pointer-events-none max-w-md mx-auto">
            <div className="text-[#f2f2f2] text-sm md:text-base font-light leading-relaxed text-start px-4" >
                {title}
            </div>
        </div>
    );
}

export default function Section2Content() {
    return (
        <>
            <Section2CenterBox
                title={`sDOGE is a "staking-like" wrapper for DOGE that allocates deposits to delta-neutral, yield-bearing strategies run with a qualified custodian.`}
            />
            <div
                className="absolute top-1/2 right-8 md:right-20 z-30 pointer-events-none"
                style={{ width: '400px', transform: 'translateY(-50%)' }}
            >
                <div className="text-[#f1f1f1] flex items-center h-full my-2" style={{margin: '0 0 40px 10px'}}>
                    <div className="text-xl border-2 border-rounded border-white/80 border-dotted rounded-full"
                        style={{ padding: '10px', marginRight: '6px' }}
                    >
                        <GiUfo />
                    </div>
                    <div className="text-xs md:text-sm font-light uppercase leading-relaxed text-start" >
                        <span className="text-[#ffd841]" >Mint</span> sDOGE 1:1 with your DOGE.
                    </div>
                </div>

                <div className="text-[#f1f1f1] flex items-center h-full my-2" style={{margin: '40px 10px'}}>
                    <div className="text-xl border-2 border-rounded border-white/80 border-dotted rounded-full"
                        style={{ padding: '10px', marginRight: '6px' }}
                    >
                        <FaRecycle />
                    </div>
                    <div className="text-xs md:text-sm font-light uppercase leading-relaxed text-start" >
                        <span className="text-[#ffd841]" >Earn</span> AUTOMATICALLY WHILE YOU HOLD.
                    </div>
                </div>

                <div className="text-[#f1f1f1] flex items-center h-full my-2" style={{margin: '40px 10px'}}>
                    <div className="text-xl border-2 border-rounded border-white/80 border-dotted rounded-full"
                        style={{ padding: '10px', marginRight: '6px' }}
                    >
                        <FaGhost />
                    </div>
                    <div className="text-xs md:text-sm font-light uppercase leading-relaxed text-start" >
                        <span className="text-[#ffd841]" >Redeem</span> BACK TO DOGE ANYTIME WITH NO TRADING OR COMPLEXITY.
                    </div>
                </div>
            </div>
        </>
    );
}
