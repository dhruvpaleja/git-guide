export interface StepProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}
