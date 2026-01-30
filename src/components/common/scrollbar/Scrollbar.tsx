import arrowUp from './icons/arrow-up.svg';
import arrowDown from './icons/arrow-down.svg';
import { useScrollbar } from './useScrollbar';

type ScrollbarProps = {
  targetRef: React.RefObject<HTMLDivElement | null>;
};

const Scrollbar = ({ targetRef }: ScrollbarProps) => {
  const {
    canScrollUp,
    canScrollDown,
    trackRef,
    thumbStyle,
    handleThumbMouseDown,
    handleTrackClick,
    scrollUp,
    scrollDown,
  } = useScrollbar(targetRef);

  return (
    <div className="absolute top-2 right-0 bottom-2 w-5 flex flex-col items-center gap-2 pointer-events-none z-10 box-border">
      <button
        className="pointer-events-auto bg-transparent border-0 cursor-pointer p-1 flex items-center justify-center transition-opacity duration-200 flex-shrink-0 h-5 hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={scrollUp}
        disabled={!canScrollUp}
      >
        <img
          src={arrowUp}
          alt="scroll up"
          className="w-4 h-2"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(64%) sepia(6%) saturate(458%) hue-rotate(181deg) brightness(93%) contrast(88%)',
          }}
        />
      </button>

      <div
        className="pointer-events-auto flex-1 w-2 rounded-full relative min-h-0"
        ref={trackRef}
        onClick={handleTrackClick}
      >
        <div
          className="w-2 min-h-4 bg-[var(--color-gray-40)] rounded-full absolute left-0 right-0 cursor-pointer transition-colors duration-200 select-none hover:bg-[var(--color-gray-50)]"
          style={thumbStyle}
          onMouseDown={handleThumbMouseDown}
        />
      </div>

      <button
        className="pointer-events-auto bg-transparent border-0 cursor-pointer p-1 flex items-center justify-center transition-opacity duration-200 flex-shrink-0 h-5 hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={scrollDown}
        disabled={!canScrollDown}
      >
        <img
          src={arrowDown}
          alt="scroll down"
          className="w-4 h-2"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(64%) sepia(6%) saturate(458%) hue-rotate(181deg) brightness(93%) contrast(88%)',
          }}
        />
      </button>
    </div>
  );
};

export default Scrollbar;
