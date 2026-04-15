'use client';

// PROXY REDIRECT
// This file exists to resolve stale build references to the old path.
// The component has been moved to: @/components/shared/Strategy/StrategyNodeEditor
import StrategyNodeEditor from '../shared/Strategy/StrategyNodeEditor';

console.warn('DEBUG: Stale import detected for StrategyNodeEditor at components/events/. Please update references to @/components/shared/Strategy/StrategyNodeEditor');

export default StrategyNodeEditor;
