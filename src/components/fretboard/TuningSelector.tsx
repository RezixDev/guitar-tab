import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TUNINGS = [
  { value: "standard", label: "Standard (EADGBE)" },
  { value: "halfStepDown", label: "Half Step Down (Eb Ab Db Gb Bb Eb)" },
  { value: "dropD", label: "Drop D (DADGBE)" },
] as const

type Tuning = (typeof TUNINGS)[number]["value"]

type TuningSelectorProps = {
  onChange: (value: Tuning) => void
  value?: Tuning
  disabled?: boolean
}

export function TuningSelector({ onChange, value = "standard", disabled = false }: TuningSelectorProps) {
	return (
    <Select onValueChange={(v) => onChange(v as Tuning)} value={value} disabled={disabled}>
      <SelectTrigger className="w-[220px]">
				<SelectValue placeholder="Select Tuning" />
			</SelectTrigger>
			<SelectContent>
        {TUNINGS.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
				</SelectItem>
        ))}
			</SelectContent>
		</Select>
  )
}
