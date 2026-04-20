export default function WorkstationLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 relative">
            {children}
        </div>
    );
}
