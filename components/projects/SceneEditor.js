'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion'; // Assuming Reorder is available or we simulate list
import { Plus, Trash2, Upload, FileVideo, GripVertical, AlignLeft } from 'lucide-react';

export default function SceneEditor({ scenes, setScenes }) {

    const addScene = () => {
        const nextId = scenes.length + 1;
        setScenes([...scenes, {
            id: Date.now(),
            name: `Escena ${nextId}`,
            description: '',
            files: [],
            priority: 'normal' // normal, high
        }]);
    };

    const removeScene = (id) => {
        setScenes(scenes.filter(s => s.id !== id));
    };

    const updateScene = (id, field, value) => {
        setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Estructura del Video</h4>
                <button
                    onClick={addScene}
                    className="text-xs flex items-center gap-2 bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors"
                >
                    <Plus className="w-3 h-3" /> Añadir Escena
                </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {scenes.map((scene, index) => (
                    <motion.div
                        key={scene.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0B0B15] border border-white/5 rounded-xl p-4 group"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="mt-1 cursor-grab text-gray-600 hover:text-white">
                                <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex-1 space-y-3">
                                {/* Header Editable */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        #{index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={scene.name}
                                        onChange={(e) => updateScene(scene.id, 'name', e.target.value)}
                                        className="bg-transparent border-none text-white font-medium focus:ring-0 p-0 text-sm w-full"
                                        placeholder="Nombre de la escena..."
                                    />
                                </div>

                                {/* Instrucciones */}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                                        <AlignLeft className="w-3 h-3" /> Instrucciones
                                    </label>
                                    <textarea
                                        value={scene.description}
                                        onChange={(e) => updateScene(scene.id, 'description', e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs text-gray-300 focus:border-primary/50 outline-none resize-none h-16"
                                        placeholder="Describe qué sucede en esta escena..."
                                    />
                                </div>

                                {/* Archivos */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                                            <Upload className="w-3 h-3" /> Material
                                        </label>
                                        <button className="text-[10px] text-blue-400 hover:text-blue-300">
                                            + Subir
                                        </button>
                                    </div>
                                    <div className="border border-dashed border-white/10 rounded-lg p-3 flex flex-col items-center justify-center text-gray-500 hover:bg-white/5 transition-colors cursor-pointer">
                                        <span className="text-xs">Arrastra archivos aquí</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => removeScene(scene.id)}
                                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {scenes.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                    <p className="text-sm">No hay escenas definidas</p>
                    <button onClick={addScene} className="text-primary text-xs mt-2 hover:underline">Crear primera escena</button>
                </div>
            )}
        </div>
    );
}
