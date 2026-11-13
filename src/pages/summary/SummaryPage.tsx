import { IonContent, IonPage } from '@ionic/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { useToday } from '../../components/useToday'
import { COMMON_COPY } from '../../copy/common'
import { useRecords } from '../../data/hooks'
import { dayMonth } from '../../domain/dayDate'
import { periodSummary } from '../../domain/summary'
import type { Records } from '../../domain/types'
import { periodLabel, SUMMARY_COPY } from './copy'
import { periodItemsPath } from './itemsFilter'
import { MostExpensive } from './MostExpensive'
import { PeriodBreakdowns } from './PeriodBreakdowns'
import { currentChoice, PERIOD_UNITS, type PeriodChoice, periodOf } from './periodChoice'
import { PeriodStepper } from './PeriodStepper'
import './summary.css'

type PeriodSummaryProps = {
  records: Records
  choice: PeriodChoice
  currentMonth: string
  onStep: (choice: PeriodChoice) => void
}

function PeriodSummary({ records, choice, currentMonth, onStep }: PeriodSummaryProps) {
  const period = periodOf(choice)
  const summary = periodSummary(records, period)

  return (
    <>
      <section className="summary-period" aria-label={periodLabel(period)}>
        <PeriodStepper choice={choice} currentMonth={currentMonth} onStep={onStep} />
        {summary.count === 0 ? (
          <p className="empty-note">{SUMMARY_COPY.emptyPeriod}</p>
        ) : (
          <Link className="summary-total" to={periodItemsPath(period)}>
            <b className="summary-total-amount num">{COMMON_COPY.shekels(summary.total)}</b>
            <span className="quiet-text">{COMMON_COPY.itemCount(summary.count)}</span>
          </Link>
        )}
      </section>
      {summary.mostExpensive.length > 0 && <MostExpensive items={summary.mostExpensive} />}
      {summary.count > 0 && (
        <PeriodBreakdowns period={period} kinds={records.kinds} byKind={summary.byKind} byShop={summary.byShop} />
      )}
    </>
  )
}

export function SummaryPage() {
  const records = useRecords()
  const currentMonth = dayMonth(useToday())
  const [choice, setChoice] = useState(() => currentChoice(currentMonth))

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <h1 className="wall-title">{SUMMARY_COPY.title}</h1>
          <ChoiceGroup
            label={SUMMARY_COPY.unitLabel}
            className="segmented summary-unit"
            choices={PERIOD_UNITS}
            chosen={choice.unit}
            labelOf={(unit) => SUMMARY_COPY.units[unit]}
            onChoose={(unit) => setChoice((shown) => ({ ...shown, unit }))}
          />
          {records && (
            <PeriodSummary records={records} choice={choice} currentMonth={currentMonth} onStep={setChoice} />
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}
