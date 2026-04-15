const fs = require('fs');

const libraryPath = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\shared\\Strategy\\StrategyNodeLibrary.js';
const canvasPath = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\shared\\Strategy\\StrategyCanvas.js';

// --- 1. Fix StrategyNodeLibrary.js ---
if (fs.existsSync(libraryPath)) {
    let content = fs.readFileSync(libraryPath, 'utf8');
    
    const dragStartOld = /onDragStart=\{\(e\) => \{[\s\S]*?\}\}/;
    const dragStartNew = `onDragStart={(e) => {
                                                        const selection = { 
                                                            type: subtype.metadata?.id || (viewMode === 'format' ? 'educativo' : subtype.parentType), 
                                                            subtype: subtype.id,
                                                            masterType: masterType,
                                                            category: viewMode === 'strategy' ? item.id : (subtype.metadata?.category || 'atracción'),
                                                            label: subtype.label,
                                                            desc: subtype.desc
                                                        };
                                                        e.dataTransfer.setData('nodeSelection', JSON.stringify(selection));
                                                    }}`;
    
    if (dragStartOld.test(content)) {
        content = content.replace(dragStartOld, dragStartNew);
        fs.writeFileSync(libraryPath, content);
        console.log('StrategyNodeLibrary.js drag data updated.');
    }
}

// --- 2. Fix StrategyCanvas.js ---
if (fs.existsSync(canvasPath)) {
    let content = fs.readFileSync(canvasPath, 'utf8');

    // Add handleDragOver and handleDrop to StrategyCanvas
    const dropLogic = `
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectionData = e.dataTransfer.getData('nodeSelection');
        if (!selectionData) return;

        try {
            const selection = JSON.parse(selectionData);
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - view.x) / view.scale;
            const y = (e.clientY - rect.top - view.y) / view.scale;

            onAddNode(selection, x - 128, y - 50);
        } catch (err) {
            console.error('Error parsing drop data:', err);
        }
    };
`;

    // Insert drop logic before the return
    if (!content.includes('handleDragOver')) {
        content = content.replace(/return \(/, dropLogic + '\n    return (');
    }

    // Add onDragOver and onDrop to the main div
    // Find the main container div in the return (usually has ref={canvasRef})
    const divRegex = /<div([\s\S]*?ref=\{canvasRef\}[\s\S]*?)>/;
    if (divRegex.test(content)) {
        content = content.replace(divRegex, '<div$1 onDragOver={handleDragOver} onDrop={handleDrop}>');
        fs.writeFileSync(canvasPath, content);
        console.log('StrategyCanvas.js drag and drop support added.');
    }
}
