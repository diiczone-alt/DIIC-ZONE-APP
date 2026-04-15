'use client';

import { motion, Reorder } from 'framer-motion';
import { Plus, Copy, Trash2, Film, Type, Layout, Settings } from 'lucide-react';

export default function SceneStrip({
    scenes,
    activeSceneId,
    onSelectScene,
    onAddScene,
    onDuplicateScene,
    onDeleteScene,
    onUpdateScene,
    onReorderScenes,
    onConfigScene
}) {
    return (
        <div className="h-full flex flex-col shrink-0 print:hidden overflow-hidden bg-transparent">
            {/* Scenes Container */}
            <div className="flex-1 overflow-x-auto no-scrollbar py-2">
                <Reorder.Group
                    axis="x"
                    values={scenes}
                    onReorder={onReorderScenes}
                    className="flex gap-4 min-w-full"
                >
                    {scenes.map((scene, index) => (
                        <Reorder.Item
                            key={scene.id}
                            value={scene}
                            className={`relative group h-28 w-44 shrink-0 cursor-grab active:cursor-grabbing transition-all rounded-xl border-2 overflow-hidden bg-black/40
                                ${scene.id === activeSceneId ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02]' : 'border-white/5 hover:border-white/20'}
                            `}
                            onClick={() => onSelectScene(scene.id)}
                        >
                            {/* Scene Header */}
                            <div className="absolute top-0 left-0 right-0 p-1.5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10">
                                <span className="text-[9px] font-black text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                                    #{index + 1}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onConfigScene(scene.id); }}
                                        className="p-1 hover:bg-indigo-500/20 rounded text-gray-400 hover:text-indigo-400"
                                    >
                                        <Settings className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDuplicateScene(scene.id); }}
                                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteScene(scene.id); }}
                                        className="p-1 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-400"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Preview / Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                {scene.canvasData ? (
                                    <img src={scene.canvasData} alt={scene.name} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="opacity-20">
                                        {scene.type === 'text' ? <Type className="w-8 h-8" /> : <Layout className="w-8 h-8" />}
                                    </div>
                                )}
                            </div>

                            {/* Scene Info Footer */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <input
                                    className="w-full bg-transparent border-none text-[10px] font-black text-white focus:outline-none focus:bg-white/10 rounded px-1 truncate"
                                    value={scene.name}
                                    onChange={(e) => onUpdateScene(scene.id, { name: e.target.value })}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tighter">
                                        {scene.type || 'Plano'}
                                    </span>
                                    <span className="text-[9px] text-indigo-400 font-mono font-bold">
                                        {scene.duration}s
                                    </span>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}

                    {/* Add Placeholder */}
                    <button
                        onClick={onAddScene}
                        className="h-28 w-28 shrink-0 rounded-xl border-2 border-dashed border-white/5 hover:border-white/20 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-indigo-400 transition-all hover:bg-white/[0.02]"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </Reorder.Group>
            </div>
        </div>
    );
}
