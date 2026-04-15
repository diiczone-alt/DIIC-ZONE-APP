import NotificationCenter from '@/components/ui/NotificationCenter';

export default function WorkstationLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 relative">
            <div className="absolute top-6 right-8 z-50">
                <NotificationCenter />
            </div>
            {children}
        </div>
    );
}
