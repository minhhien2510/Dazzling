import React from 'react';
import type { BoothStage } from '../../types/photobooth';

const STEPS: { key: BoothStage; label: string }[] = [
  { key: 'STUDIO', label: 'Studio' },
  { key: 'COMPLETED', label: 'Kết quả' },
];

const STAGE_ORDER: BoothStage[] = ['STUDIO', 'GENERATING', 'COMPLETED'];

function stageIndex(stage: BoothStage): number {
  if (stage === 'GENERATING') return 0;
  return STAGE_ORDER.indexOf(stage);
}

interface StepIndicatorProps {
  currentStage: BoothStage;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStage }) => {
  const currentIdx = stageIndex(currentStage);

  return (
    <nav className="booth-step-indicator" aria-label="Photobooth progress">
      {STEPS.map((step, i) => {
        const stepIdx = STAGE_ORDER.indexOf(step.key);
        const isActive =
          currentIdx === stepIdx ||
          (currentStage === 'GENERATING' && step.key === 'STUDIO');
        const isDone = currentIdx > stepIdx && currentStage !== 'GENERATING';

        return (
          <div
            key={step.key}
            className={`booth-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="booth-step-num">{isDone ? '✓' : i + 1}</span>
            <span>{step.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

export default StepIndicator;
