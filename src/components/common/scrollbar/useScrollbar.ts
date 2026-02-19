import { useState, useEffect, useRef, useCallback } from 'react';

type UseScrollbarReturn = {
  scrollProgress: number;
  thumbHeight: number;
  canScrollUp: boolean;
  canScrollDown: boolean;
  isDragging: boolean;
  trackRef: React.RefObject<HTMLDivElement | null>;
  thumbStyle: { height: string; top: string };
  handleThumbMouseDown: (e: React.MouseEvent) => void;
  handleTrackClick: (e: React.MouseEvent) => void;
  scrollUp: () => void;
  scrollDown: () => void;
};

export const useScrollbar = (
  targetRef: React.RefObject<HTMLDivElement | null>
): UseScrollbarReturn => {
  const scrollByAmount = 60;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(40);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateScrollbar = useCallback(() => {
    const element = targetRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      setScrollProgress(0);
      setThumbHeight(100);
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const thumbHeightPercent = (clientHeight / scrollHeight) * 100;
    setThumbHeight(Math.max(thumbHeightPercent, 10));

    const progress = (scrollTop / maxScroll) * 100;
    setScrollProgress(Math.max(0, Math.min(100, progress)));
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < maxScroll - 1);
  }, [targetRef]);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    requestAnimationFrame(updateScrollbar);
    element.addEventListener('scroll', updateScrollbar);
    window.addEventListener('resize', updateScrollbar);

    return () => {
      element.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [targetRef, updateScrollbar]);

  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const element = targetRef.current;
      const track = trackRef.current;
      if (!element || !track) return;

      const startY = e.clientY;
      const startScrollTop = element.scrollTop;
      const trackHeight = track.clientHeight;
      const { scrollHeight, clientHeight } = element;
      const maxScroll = scrollHeight - clientHeight;
      const scrollRatio =
        maxScroll / (trackHeight - (trackHeight * thumbHeight) / 100);

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        const newScrollTop = startScrollTop + deltaY * scrollRatio;
        element.scrollTop = Math.max(0, Math.min(maxScroll, newScrollTop));
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [targetRef, thumbHeight]
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;

      const track = trackRef.current;
      const element = targetRef.current;
      if (!track || !element) return;

      const rect = track.getBoundingClientRect();
      const clickPercent = (e.clientY - rect.top) / rect.height;
      const { scrollHeight, clientHeight } = element;
      const maxScroll = scrollHeight - clientHeight;

      element.scrollTo({ top: clickPercent * maxScroll, behavior: 'smooth' });
    },
    [targetRef, isDragging]
  );

  const scrollUp = useCallback(() => {
    targetRef.current?.scrollBy({
      top: -scrollByAmount,
      behavior: 'smooth',
    });
  }, [targetRef]);

  const scrollDown = useCallback(() => {
    targetRef.current?.scrollBy({
      top: scrollByAmount,
      behavior: 'smooth',
    });
  }, [targetRef]);

  const thumbTop = (scrollProgress / 100) * (100 - thumbHeight);
  const thumbStyle = {
    height: `${thumbHeight}%`,
    top: `${thumbTop}%`,
  };

  return {
    scrollProgress,
    thumbHeight,
    canScrollUp,
    canScrollDown,
    isDragging,
    trackRef,
    thumbStyle,
    handleThumbMouseDown,
    handleTrackClick,
    scrollUp,
    scrollDown,
  };
};
