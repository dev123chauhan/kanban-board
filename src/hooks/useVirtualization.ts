import { useState, useCallback, useMemo } from 'react';

interface UseVirtualizationProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = ({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualizationProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  const totalHeight = itemCount * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      position: 'absolute',
      top: index * itemHeight,
      height: itemHeight,
      width: '100%',
    }),
    [itemHeight]
  );

  return {
    visibleRange,
    totalHeight,
    handleScroll,
    getItemStyle,
  };
};