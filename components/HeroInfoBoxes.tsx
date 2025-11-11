'use client';

interface HeroInfoBoxProps {
  position: 'left' | 'right';
  title: string;
  value: string;
}

function HeroInfoBox({ position, title, value }: HeroInfoBoxProps) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/4 ${position === 'left' ? 'left-8 md:left-16' : 'right-8 md:right-16'} z-30 pointer-events-none py-8`}
    >
      {/* Ruler Milestones - Vertical dashes along the edge */}
      <div 
        className={`absolute top-0 bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} flex flex-col justify-between`}
        style={{ height: 'calc(100% + 4rem)', top: '-2rem', bottom: '-2rem' }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const isLongTick = i % 3 === 0;
          return (
            <div
              key={i}
              className={`bg-[#ffffff]/80 ${isLongTick ? 'w-4 h-0.75' : 'w-2 h-0.5'}`}
              style={{
                marginLeft: position === 'left' ? '0' : 'auto',
                marginRight: position === 'right' ? '0' : 'auto',
              }}
            />
          );
        })}
      </div>

      {/* Text Content */}
      <div 
        className="text-[#ffd841] flex flex-col justify-between"
        style={{
          marginLeft: position === 'left' ? '1.5rem' : '0',
          marginRight: position === 'right' ? '1.5rem' : '0',
        }}
      >
        <div className="text-xs md:text-sm font-normal uppercase leading-relaxed" style={{ marginBottom: '4rem', paddingTop: '0' }}>
          {title}
        </div>
        <div className="text-xs md:text-sm font-normal text-right" style={{ paddingBottom: '0' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
export default function HeroInfoBoxes() {
  return (
    <>
      <HeroInfoBox
        position="left"
        title="TURN DOGE INTO SDOGE."
        value="APR $38,449,783,518"
      />
      <HeroInfoBox
        position="right"
        title="EARN YIELD. KEEP LIQUIDITY."
        value="TVL 2.6%"
      />
    </>
  );
}

