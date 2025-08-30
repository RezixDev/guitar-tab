
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

const pointsOptions = [5, 10, 20, 30, 40, 50] as const
type Points = (typeof pointsOptions)[number]

type PointsSelectorProps = {
  value: Points
  onChange: (value: Points) => void
  disabled?: boolean
}

export function PointsSelector({
	value,
	onChange,
	disabled = false,
}: PointsSelectorProps) {
	return (
		<Select
      value={`${value}`}
      onValueChange={(v) => onChange(Number(v) as Points)}
			disabled={disabled}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select Target Points" />
			</SelectTrigger>
			<SelectContent>
        {pointsOptions.map((points) => (
          <SelectItem key={points} value={`${points}`}>
            {points} points
					</SelectItem>
				))}
			</SelectContent>
		</Select>
  )
}
