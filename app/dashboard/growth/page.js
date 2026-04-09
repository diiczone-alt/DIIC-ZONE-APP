import GrowthLanding from '@/components/growth/GrowthLanding';

export const metadata = {
    title: 'Planes y Crecimiento | DIIC ZONE',
    description: 'Haz crecer tu marca con estrategia, contenido y sistemas automatizados.',
};

export default function GrowthPage() {
    return (
        <div className="flex-1 min-w-0 bg-[#050511]">
            <GrowthLanding />
        </div>
    );
}
