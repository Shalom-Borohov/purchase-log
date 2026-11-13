import { ChevronIcon } from '../../components/icons'
import { periodLabel, SUMMARY_COPY } from './copy'
import { isLatestPeriod, nextChoice, type PeriodChoice, periodOf, previousChoice } from './periodChoice'

type PeriodStepperProps = {
  choice: PeriodChoice
  currentMonth: string
  onStep: (choice: PeriodChoice) => void
}

export function PeriodStepper({ choice, currentMonth, onStep }: PeriodStepperProps) {
  return (
    <div className="period-stepper">
      <button
        type="button"
        className="period-step period-step-previous"
        aria-label={SUMMARY_COPY.previous[choice.unit]}
        onClick={() => onStep(previousChoice(choice))}
      >
        <ChevronIcon />
      </button>
      <p className="period-stepper-label">{periodLabel(periodOf(choice))}</p>
      <button
        type="button"
        className="period-step"
        aria-label={SUMMARY_COPY.next[choice.unit]}
        disabled={isLatestPeriod(choice, currentMonth)}
        onClick={() => onStep(nextChoice(choice, currentMonth))}
      >
        <ChevronIcon />
      </button>
    </div>
  )
}
