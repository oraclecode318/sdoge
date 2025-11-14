'use client';

import { useState, useEffect } from 'react';

interface ChatPanelProps {
    scrollProgress: number;
}

interface ChatHistory {
    id: string;
    title: string;
}

interface ChatMessage {
    id: string;
    user: string;
    message: string;
    isBot: boolean;
}

interface ChatConversation {
    [key: string]: ChatMessage[];
}

export default function Section4ChatPanel({ scrollProgress }: ChatPanelProps) {
    // Smooth transition from section 3 to section 4 (50% to 67% progress)
    const section3End = 0.5; // End of section 3
    const section4Start = 0.57; // Start of section 4
    const [isMounted, setIsMounted] = useState(false);
    const [selectedChat, setSelectedChat] = useState('what-is-sdoge');

    // Ensure consistent hydration - only show after client-side mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything until mounted or before section 3 ends
    if (!isMounted || scrollProgress < section3End) return null;

    // Calculate smooth transition values
    const transitionRange = section4Start - section3End; // 0.07 range
    const transitionProgress = Math.min(1, Math.max(0, (scrollProgress - section3End) / transitionRange));
    
    // Smooth opacity and transform transitions
    const opacity = transitionProgress;
    const translateY = (1 - transitionProgress) * 30; // Start 30px below, move to 0
    const scale = 0.9 + (transitionProgress * 0.1); // Start at 90%, grow to 100%

    // Static chat data
    const chatHistories: ChatHistory[] = [
        { id: 'what-is-sdoge', title: 'WHAT IS SDOGE?' },
        { id: 'how-rewards-work', title: 'HOW DO REWARDS WORK?' },
        { id: 'yield-source', title: 'WHERE DOES THE YIELD COME FROM?' },
        { id: 'doge-safety', title: 'IS MY DOGE SAFE?' },
        { id: 'defi-usage', title: 'CAN I USE SDOGE IN DEFI?' },
    ];

    // Static chat conversations
    const conversations: ChatConversation = {
        'what-is-sdoge': [
            {
                id: '1',
                user: 'You',
                message: 'What is sDOGE?',
                isBot: false
            },
            {
                id: '2',
                user: 'sDOGE',
                message: "I'm your on-chain receipt for DOGE deposits.",
                isBot: true
            },
            {
                id: '3',
                user: 'sDOGE',
                message: 'When you mint sDOGE, your DOGE is staked into delta-neutral strategies run by a qualified custodian.',
                isBot: true
            },
            {
                id: '4',
                user: 'You',
                message: "So... it's like wrapped DOGE?",
                isBot: false
            },
            {
                id: '5',
                user: 'sDOGE',
                message: 'Close but smarter.',
                isBot: true
            },
            {
                id: '6',
                user: 'sDOGE',
                message: 'Wrapped tokens just mirror value. sDOGE earns yield while staying redeemable.',
                isBot: true
            }
        ],
        'how-rewards-work': [
            {
                id: '1',
                user: 'You',
                message: 'How do rewards work?',
                isBot: false
            },
            {
                id: '2',
                user: 'sDOGE',
                message: 'Rewards come from funding rate arbitrage and basis trading strategies.',
                isBot: true
            },
            {
                id: '3',
                user: 'sDOGE',
                message: 'Your sDOGE balance automatically increases as rewards are distributed.',
                isBot: true
            }
        ],
        'yield-source': [
            {
                id: '1',
                user: 'You',
                message: 'Where does the yield come from?',
                isBot: false
            },
            {
                id: '2',
                user: 'sDOGE',
                message: 'Yield comes from funding rates and basis spreads in DOGE markets.',
                isBot: true
            },
            {
                id: '3',
                user: 'sDOGE',
                message: 'We maintain delta-neutral positions to capture these opportunities while keeping your DOGE exposure.',
                isBot: true
            }
        ],
        'doge-safety': [
            {
                id: '1',
                user: 'You',
                message: 'Is my DOGE safe?',
                isBot: false
            },
            {
                id: '2',
                user: 'sDOGE',
                message: 'Your DOGE is held by qualified custodians and used in regulated trading strategies.',
                isBot: true
            },
            {
                id: '3',
                user: 'sDOGE',
                message: 'All positions are delta-neutral, so your DOGE value is protected.',
                isBot: true
            }
        ],
        'defi-usage': [
            {
                id: '1',
                user: 'You',
                message: 'Can I use sDOGE in DeFi?',
                isBot: false
            },
            {
                id: '2',
                user: 'sDOGE',
                message: 'Yes! sDOGE is a standard ERC-20 token that can be used across DeFi protocols.',
                isBot: true
            },
            {
                id: '3',
                user: 'sDOGE',
                message: 'You can trade, lend, or provide liquidity while still earning sDOGE yield.',
                isBot: true
            }
        ]
    };

    return (
        <>
            {/* Custom Scrollbar Styles & RGB Split Effect */}
            <style jsx>{`
                .chat-messages-scroll::-webkit-scrollbar {
                    width: 8px;
                }
                .chat-messages-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .chat-messages-scroll::-webkit-scrollbar-thumb {
                    background: #ffd841;
                    border-radius: 4px;
                }
                .chat-messages-scroll::-webkit-scrollbar-thumb:hover {
                    background: #ffed70;
                }
                
                @keyframes rgbSplitIntense {
                    0% {
                        text-shadow: 
                            3px 0 0 #ff0040,
                            -3px 0 0 #00ffff;
                    }
                    20% {
                        text-shadow: 
                            6px 0 0 #ff0040,
                            -6px 0 0 #00ffff,
                            0 3px 0 #40ff00;
                    }
                    40% {
                        text-shadow: 
                            9px 0 0 #ff0040,
                            -9px 0 0 #00ffff,
                            0 6px 0 #40ff00;
                    }
                    60% {
                        text-shadow: 
                            6px 0 0 #ff0040,
                            -6px 0 0 #00ffff,
                            0 3px 0 #40ff00;
                    }
                    80% {
                        text-shadow: 
                            3px 0 0 #ff0040,
                            -3px 0 0 #00ffff;
                    }
                    100% {
                        text-shadow: 
                            3px 0 0 #ff0040,
                            -3px 0 0 #00ffff;
                    }
                }
                .rgb-split-text-intense {
                    animation: rgbSplitIntense 2.5s ease-in-out infinite;
                }
            `}</style>
            
            {/* Ask sDOGE Headline */}
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
                    className="rgb-split-text-intense"
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
                    Ask sDOGE
                </div>
            </div>

            {/* Chat Interface Container */}
            <div 
                className="absolute top-[55%] left-[50%] z-30 pointer-events-auto"
                style={{
                    opacity: opacity,
                    transform: `translateX(-50%) translateY(calc(-50% + ${translateY}px)) scale(${scale})`,
                    transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
                    width: '90vw',
                    maxWidth: '1200px',
                    height: '500px'
                }}
            >
                <div className="flex gap-6 h-full">
                    {/* Left Panel - Chat Histories */}
                    <div className="w-[30%] border-2 border-white/30 border-dotted rounded flex flex-col">
                        {/* Header section */}
                        <div className="text-white p-7 text-lg uppercase font-light tracking-wide border-b-2 border-white/30 border-dotted" >
                            //
                        </div>
                        
                        {/* Chat History Items - auto height based on content */}
                        <div className="space-y-2 p-6 flex-shrink-0">
                            {chatHistories.map((history) => (
                                <button
                                    key={history.id}
                                    onClick={() => setSelectedChat(history.id)}
                                    className={`w-full text-left p-3 rounded transition-all duration-200 ${
                                        selectedChat === history.id 
                                            ? 'border-[#ffd841] bg-[#ffd841]' 
                                            : 'border-white/30 hover:border-white/50'
                                    }`}
                                >
                                    <div 
                                        className={`text-xs font-semibold ${
                                            selectedChat === history.id ? 'text-black' : 'text-white/70'
                                        }`}
                                        style={{ fontFamily: 'var(--font-beltram)' }}
                                    >
                                        {history.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Chat Conversation */}
                    <div className="w-[70%] border-2 border-white/30 border-dotted rounded">
                        <div className="h-full flex flex-col">
                            {/* Chat Header */}
                            <div className="flex items-center mb-6 pb-0 border-b-2 border-white/30 border-dotted">
                                <div className="w-[84px] h-[84px] bg-transparent border-r-2 border-white/30 border-dotted flex items-center justify-center">
                                    <img 
                                        src="/image/doge_head.png" 
                                        alt="sDOGE" 
                                        className="w-[84px] h-[84px] object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex justify-between items-center px-6">
                                    <div className="text-white/80 text-sm font-medium" style={{ fontFamily: 'var(--font-beltram)' }}>
                                        sDOGE
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                        <div className="text-white/50 text-xs" style={{ fontFamily: 'var(--font-beltram)' }}>
                                            ONLINE
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div 
                                className="flex-1 overflow-y-auto space-y-4 px-6 chat-messages-scroll pb-4"
                                onWheel={(e) => {
                                    // Prevent outer scroll when scrolling within chat messages
                                    e.stopPropagation();
                                }}
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#ffd841 transparent',
                                }}
                            >
                                {conversations[selectedChat]?.map((message) => (
                                    <div key={message.id} className={`flex py-4 items-start ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                                        {message.isBot && (
                                            <div className="w-8 h-8 bg-transparent rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                                <img 
                                                    src="/image/cursor.png" 
                                                    alt="sDOGE" 
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            </div>
                                        )}
                                        <div className={`max-w-[80%] p-3 rounded-lg ${
                                            message.isBot 
                                                ? 'bg-white/10 border border-white/20' 
                                                : 'bg-[#ffd841]/20 border border-[#ffd841]/30'
                                        }`}>
                                            <div className="text-white text-sm" style={{ fontFamily: 'var(--font-beltram)' }}>
                                                {message.message}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Current Question Display */}
                            {/* <div className="mt-4 pt-4 border-t border-white/20 px-6 pb-6">
                                <div className="text-white/70 text-xs mb-2" style={{ fontFamily: 'var(--font-beltram)' }}>
                                    What is sDOGE?
                                </div>
                                <div className="text-white text-sm" style={{ fontFamily: 'var(--font-beltram)' }}>
                                    {chatHistories.find(h => h.id === selectedChat)?.title}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
