import type { ReactNode } from 'react'
import './ChoiceGroup.css'

type ChoiceGroupBase<Choice extends string> = {
  label?: string
  className?: string
  choices: readonly Choice[]
  chosen: Choice | undefined
  labelOf: (choice: Choice) => ReactNode
}

type ClearableChoiceGroupProps<Choice extends string> = ChoiceGroupBase<Choice> & {
  tapAgainClears: true
  onChoose: (choice: Choice | undefined) => void
}

type FixedChoiceGroupProps<Choice extends string> = ChoiceGroupBase<Choice> & {
  tapAgainClears?: false
  onChoose: (choice: Choice) => void
}

type ChoiceGroupProps<Choice extends string> = ClearableChoiceGroupProps<Choice> | FixedChoiceGroupProps<Choice>

export function ChoiceGroup<Choice extends string>(props: ChoiceGroupProps<Choice>) {
  const { label, className, choices, chosen, labelOf } = props

  function choose(choice: Choice) {
    if (props.tapAgainClears && choice === chosen) {
      props.onChoose(undefined)

      return
    }

    props.onChoose(choice)
  }

  return (
    <div
      className={className ? `choice-group ${className}` : 'choice-group'}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className="choice"
          aria-pressed={choice === chosen}
          onClick={() => choose(choice)}
        >
          {labelOf(choice)}
        </button>
      ))}
    </div>
  )
}
