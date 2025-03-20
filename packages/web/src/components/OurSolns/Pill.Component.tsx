import clsx from 'clsx'

interface IPill {
  title: string
  onPress: VoidFunction
  selected: boolean
}

function Pill({ title, onPress, selected }: IPill) {
  return (
    <button
      className={clsx([
        'rounded-md px-6 py-1',
        selected
          ? 'bg-primary text-white'
          : 'border-primary text-primary border'
      ])}
      onClick={onPress}
    >
      <p>{title}</p>
    </button>
  )
}

export default Pill
