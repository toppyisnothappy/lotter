"use client"

import { useEffect, useRef } from 'react';

interface UseBarcodeScannerProps {
    onScan: (barcode: string) => void;
    /** Defaults to true so we don't interfere with manual typing */
    ignoreOnActiveInput?: boolean;
    /** Maximum time (in ms) between keystrokes to be considered a scan */
    maxDelay?: number;
    /** Minimum length of the final scanned barcode string to trigger onScan */
    minLength?: number;
}

export function useBarcodeScanner({
    onScan,
    ignoreOnActiveInput = true,
    maxDelay = 50,
    minLength = 4
}: UseBarcodeScannerProps) {
    const buffer = useRef('');
    const lastKeyTime = useRef(performance.now());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (ignoreOnActiveInput) {
                const activeEl = document.activeElement;
                if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
                    return;
                }
            }

            const currentTime = performance.now();

            if (currentTime - lastKeyTime.current > maxDelay) {
                buffer.current = '';
            }

            if (e.key === 'Enter') {
                if (buffer.current.length >= minLength) {
                    onScan(buffer.current);
                    e.preventDefault();
                }
                buffer.current = '';
            } else if (e.key.length === 1) {
                buffer.current += e.key;
            }

            lastKeyTime.current = currentTime;
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onScan, ignoreOnActiveInput, maxDelay, minLength]);
}
