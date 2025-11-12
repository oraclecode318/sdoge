'use client';

interface HeroInfoBoxProps {
  position: 'left' | 'right';
  title: string;
  value: string;
}

function HeroInfoBox({ position, title, value }: HeroInfoBoxProps) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${position === 'left' ? 'left-8 md:left-16' : 'right-8 md:right-16'} z-30 pointer-events-none`}
      style={{ height: '12rem' }}
    >
      {/* Ruler Milestones - Vertical dashes along the edge */}
      <div 
        className={`absolute top-0 bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} flex flex-col justify-between h-full`}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const isLongTick = i % 9 === 0;
          return (
            <div
              key={i}
              className={`bg-[#ffffff]/80 ${isLongTick ? 'w-4 h-0.5' : 'w-3 h-0.25'}`}
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
        className="text-[#ffd841] flex flex-col justify-between h-full"
        style={{
          marginLeft: position === 'left' ? '1.5rem' : '0',
          marginRight: position === 'right' ? '1.5rem' : '0',
        }}
      >
        <div className="text-xs md:text-sm font-normal uppercase leading-relaxed">
          {title}
        </div>
        <div className="text-xs md:text-sm font-normal text-right">
          <span className="text-white">{value.split(' ')[0]}</span>
          {value.split(' ').length > 1 && (
            <span className="text-[#ffd841]"> {value.split(' ').slice(1).join(' ')}</span>
          )}
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

