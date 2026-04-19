
const fs = require('fs');
const path = 'c:\\PROYECTOS\\DIICZONE_APP\\components\\workstation\\cm\\CMWorkstationLayout.js';

try {
    let data = fs.readFileSync(path);
    let text = data.toString('utf8');

    const newFunc = `function CMProfileView({ user }) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-gradient-to-br from-[#0E0E18] to-[#050511] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />
                
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-cyan-500/20">
                        {user?.full_name?.charAt(0) || "R"}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">{user?.full_name || "Reyshell"}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-4 py-1 bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest">Lead Estratega</span>
                            <span className="px-4 py-1 bg-white/5 border border-white/5 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">DIIC Zone HQ</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Ecosistemas</p>
                        <h4 className="text-2xl font-black text-white italic tracking-tighter">14 ACTIVOS</h4>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Rendimiento</p>
                        <h4 className="text-2xl font-black text-emerald-400 italic tracking-tighter">98.4% SCORE</h4>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Sincronización</p>
                        <h4 className="text-2xl font-black text-cyan-400 italic tracking-tighter">NIVEL ÉLITE</h4>
                    </div>
                </div>
            </div>

            <div className="bg-[#0E0E18] border border-white/5 rounded-[3rem] p-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    Configuración de Operaciones
                </h3>
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm font-medium italic">Próximamente: Personalización de notificaciones y temas de workstation.</p>
                </div>
            </div>
        </div>
    );
}

`;

    // Replace the entire broken end part. We'll find where "function CMProfileView" starts and replace everything from there to the end.
    const startIdx = text.lastIndexOf('function CMProfileView');
    if (startIdx !== -1) {
        const fixedText = text.substring(0, startIdx) + newFunc;
        fs.writeFileSync(path, fixedText, 'utf8');
        console.log('File recovery complete.');
    } else {
        console.error('Could not find start of function.');
    }
} catch (err) {
    console.error('Error fixing file:', err);
}
