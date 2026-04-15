'use client';

import { TrendingUp } from 'lucide-react';
import ModulePlaceholder from '../../../components/ui/ModulePlaceholder';

export default function MarketingPage() {
    return (
        <ModulePlaceholder
            title="Growth Marketing 📈"
            description="Estrategias de pauta, SEO y embudos de venta."
            icon={TrendingUp}
        />
    );
}
