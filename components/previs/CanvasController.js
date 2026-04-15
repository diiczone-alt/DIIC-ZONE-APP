'use client';

import { useState, useCallback, useRef } from 'react';

export function useCanvasController(initialScale = 1) {
    const [view, setView] = useState({ x: 0, y: 0, scale: initialScale });
    const [isPanning, setIsPanning] = useState(false);
    const startPanPos = useRef({ x: 0, y: 0 });

    const handleWheel = useCallback((e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            const newScale = Math.min(Math.max(0.1, view.scale + delta), 5);
            setView(prev => ({ ...prev, scale: newScale }));
        } else {
            setView(prev => ({
                ...prev,
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
        }
    }, [view.scale]);

    const startPanning = useCallback((e) => {
        if (e.button === 1 || (e.button === 0 && e.spaceKey)) {
            setIsPanning(true);
            startPanPos.current = { x: e.clientX - view.x, y: e.clientY - view.y };
        }
    }, [view.x, view.y]);

    const doPan = useCallback((e) => {
        if (!isPanning) return;
        setView(prev => ({
            ...prev,
            x: e.clientX - startPanPos.current.x,
            y: e.clientY - startPanPos.current.y
        }));
    }, [isPanning]);

    const stopPanning = useCallback(() => {
        setIsPanning(false);
    }, []);

    const screenToCanvas = useCallback((clientX, clientY, containerRect) => {
        if (!containerRect) return { x: clientX, y: clientY };
        return {
            x: (clientX - containerRect.left - view.x) / view.scale,
            y: (clientY - containerRect.top - view.y) / view.scale
        };
    }, [view]);

    return {
        view,
        setView,
        handleWheel,
        startPanning,
        doPan,
        stopPanning,
        isPanning,
        screenToCanvas
    };
}
