'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GallerySidebar from '@/components/gallery/GallerySidebar';
import GalleryDashboard from '@/components/gallery/GalleryDashboard';
import GalleryBottomPlayer from '@/components/gallery/GalleryBottomPlayer';

// MOCK DATA
const MOCK_FILES = [
    { id: 1, name: 'Nine Track Mind', type: 'video', category: 'videos', department: 'Rhythm and Blues', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80', description: 'Studio album by Charlie Puth.' },
    { id: 2, name: 'Coloring Book', type: 'design', category: 'albums', department: 'Hip Hop', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80', description: 'Chance The Rapper.', isFavorite: true },
    { id: 3, name: 'LP1', type: 'audio', category: 'music', department: 'Trip Hop', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80', description: 'Studio album by FKA Twigs.', isFeatured: true },
    { id: 4, name: 'Willpower', type: 'design', category: 'albums', department: 'Dance Pop', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', description: 'Studio album by will.i.am.' },
    { id: 5, name: 'Social Reels Batch', type: 'video', category: 'videos', department: 'Social', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', description: 'Vertical content ready for scheduling.', isFavorite: true },
    { id: 6, name: 'Event Recap 2024', type: 'video', category: 'videos', department: 'Filmmaker', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', description: 'Full coverage of the annual event.', isFeatured: true },
    { id: 7, name: 'Personal Portfolio', type: 'photo', category: 'albums', department: 'Photography', image: 'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80', description: 'Selected shots for portfolio.' },
    { id: 8, name: 'Campaign Summer', type: 'video', category: 'videos', department: 'Commercial', image: 'https://images.unsplash.com/photo-1551021966-2a62d008779c?w=800&q=80' },
    { id: 9, name: 'Neon City', type: 'photo', category: 'photos', department: 'Art', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80', isFavorite: true },
    { id: 10, name: 'Voiceovers Q3', type: 'audio', category: 'audios', department: 'Voice', image: 'https://images.unsplash.com/photo-1478737270239-2f52b27e90f3?w=800&q=80' },
    { id: 11, name: 'Podcast Intro', type: 'audio', category: 'audios', department: 'Podcast', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80' },
    { id: 12, name: 'Background Score', type: 'audio', category: 'music', department: 'Music', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', isFeatured: true },
    { id: 13, name: 'Logo Assets', type: 'image', category: 'images', department: 'Branding', image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80' },
    { id: 14, name: 'Website Banners', type: 'image', category: 'images', department: 'Web', image: 'https://images.unsplash.com/photo-1558655146-d09347e0c708?w=800&q=80' },
    { id: 15, name: 'Portrait Session', type: 'photo', category: 'photos', department: 'Photography', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80' },
];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState({ id: 'videos', label: 'Videos' }); // Default to Videos
    const [selectedFile, setSelectedFile] = useState(null);

    // Filter Logic
    const filteredFiles = useMemo(() => {
        if (!selectedCategory) return MOCK_FILES;
        const cid = selectedCategory.id;

        if (cid === 'favorites') return MOCK_FILES.filter(f => f.isFavorite);
        if (cid === 'featured') return MOCK_FILES.filter(f => f.isFeatured);

        // Match category directly (e.g. 'photos', 'images') or generic type fallback
        return MOCK_FILES.filter(f => f.category === cid || f.type === cid || (cid === 'photos' && f.type === 'photo') || (cid === 'images' && f.type === 'image'));
    }, [selectedCategory]);

    return (
        <div className="h-[calc(100vh-4rem)] flex relative overflow-hidden bg-[#24242E] -m-4 rounded-[0rem]">

            {/* LEFT SIDEBAR */}
            <div className="w-64 flex-shrink-0 bg-[#0F0F13] z-20">
                <GallerySidebar
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
            </div>

            {/* MAIN CONTENT DASHBOARD */}
            <div className="flex-1 relative bg-gradient-to-br from-[#2B2B36] to-[#1E1E24] shadow-2xl z-10 flex flex-col">
                <GalleryDashboard
                    files={filteredFiles}
                    category={selectedCategory}
                    onSelectFile={setSelectedFile}
                />
            </div>

            {/* BOTTOM PLAYER */}
            <GalleryBottomPlayer activeFile={selectedFile} />

        </div>
    );
}
