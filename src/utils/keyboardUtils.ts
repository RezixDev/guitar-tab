import React, { useEffect } from 'react';
// utils/keyboardUtils.ts
export const useKeyboardNavigation = (
    fretboardRef: React.RefObject<HTMLDivElement>,
    handleFretClick: (string: number, fret: number) => void
  ) => {

    const currentString = React.useRef(0);
    const currentFret = React.useRef(0);

    useEffect(() => {

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowUp':
            currentString.current = Math.max(0, currentString.current - 1);
            break;
          case 'ArrowDown':
            currentString.current = Math.min(5, currentString.current + 1);
            break;
          case 'ArrowLeft':
            currentFret.current = Math.max(0, currentFret.current - 1);
            break;
          case 'ArrowRight':
            currentFret.current = Math.min(11, currentFret.current + 1);
            break;
          case 'Enter':
          case ' ':
            handleFretClick(currentString.current, currentFret.current);
            break;
        }
  
        // Update visual focus indicator
        const focusIndicator = fretboardRef.current?.querySelector('.focus-indicator');
        if (focusIndicator) {
          focusIndicator.setAttribute(
            'transform',
            `translate(${currentFret.current * 75 + 40}, ${
              currentString.current * 50
            })`
          );
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fretboardRef, handleFretClick]);
  };