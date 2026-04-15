const fs = require('fs');

const boardPath = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\shared\\Automation\\AutomationBoard.js';
const canvasPath = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\shared\\Automation\\AutomationCanvas.js';

// --- 1. Fix AutomationBoard.js ---
if (fs.existsSync(boardPath)) {
    let content = fs.readFileSync(boardPath, 'utf8');
    
    // Update handleAddNode to support selection object and position
    content = content.replace(
        /const handleAddNode = \(typeId\) => \{[\s\S]*?const typeConfig = AUTO_NODE_TYPES\[typeId\];/,
        `const handleAddNode = (selection, x, y) => {
        const typeId = typeof selection === 'string' ? selection : selection.type;
        const typeConfig = AUTO_NODE_TYPES[typeId];`
    );
    
    content = content.replace(
        /position: \{ x: -view\.x \+ window\.innerWidth \/ 2, y: -view\.y \+ window\.innerHeight \/ 2 \},/,
        'position: { x: x || (-view.x + window.innerWidth / 2), y: y || (-view.y + window.innerHeight / 2) },'
    );

    // Make sidebar buttons draggable
    content = content.replace(
        /<button([\s\S]*?)key=\{typeId\}([\s\S]*?)onClick=\{\(\) => handleAddNode\(typeId\)\}/g,
        `<button$1key={typeId}$2
                                                                draggable
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData('nodeType', typeId);
                                                                }}
                                                                onClick={() => handleAddNode(typeId)}`
    );

    // Pass onAddNode to AutomationCanvas
    content = content.replace(
        /<AutomationCanvas/,
        '<AutomationCanvas\n                    onAddNode={handleAddNode}'
    );

    fs.writeFileSync(boardPath, content);
    console.log('AutomationBoard.js updated.');
}

// --- 2. Fix AutomationCanvas.js ---
if (fs.existsSync(canvasPath)) {
    let content = fs.readFileSync(canvasPath, 'utf8');

    // Add handleDragOver and handleDrop
    const dropLogic = `
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const typeId = e.dataTransfer.getData('nodeType');
        if (!typeId) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - view.x) / view.scale;
        const y = (e.clientY - rect.top - view.y) / view.scale;

        onAddNode(typeId, x - 140, y - 60); // Center on drop
    };
`;

    if (!content.includes('handleDragOver')) {
        content = content.replace(/return \(/, dropLogic + '\n    return (');
    }

    // Add listeners to main div
    const divMatch = /<div([\s\S]*?)ref=\{canvasRef\}/;
    if (divMatch.test(content)) {
        content = content.replace(divMatch, '<div$1ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop}');
        fs.writeFileSync(canvasPath, content);
        console.log('AutomationCanvas.js updated.');
    }
}
