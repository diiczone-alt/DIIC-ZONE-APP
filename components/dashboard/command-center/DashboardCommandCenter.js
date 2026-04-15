'use client';

import { Suspense } from 'react';
import StatusHologram from './StatusHologram';
import OperationsConsole from './OperationsConsole';
import AIRadarWidget from './AIRadarWidget';
import ProductionLiveFeed from './ProductionLiveFeed';
import GrowthVisionChart from './GrowthVisionChart';
import GrowthPulseWidget from './GrowthPulseWidget';

export default function DashboardCommandCenter({ userLevel }) {
    return (
        <div className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-8 pb-20">

            {/* 1. Global Status Hologram */}
            <div className="animate-in fade-in slide-in-from-top-10 duration-700">
                <StatusHologram />
            </div>

            {/* 2. Operations Metrics Console */}
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                <OperationsConsole />
            </div>

            {/* 3. Main Operational Grid: AI Radar + Production Feed + Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: AI & Production (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-8">

                    {/* Live Production Feed */}
                    <div className="animate-in fade-in slide-in-from-left-10 duration-700 delay-200">
                        <ProductionLiveFeed />
                    </div>

                    {/* Growth Chart (Future Vision) */}
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <GrowthVisionChart />
                    </div>
                </div>

                {/* Right: Growth & AI Radar (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-8 h-full">

                    {/* Growth Pulse (New) */}
                    <div className="h-[280px] animate-in fade-in slide-in-from-right-10 duration-700 delay-350">
                        <GrowthPulseWidget />
                    </div>

                    <div className="flex-1 animate-in fade-in slide-in-from-right-10 duration-700 delay-400">
                        <AIRadarWidget />
                    </div>
                </div>

            </div>
        </div>
    );
}
