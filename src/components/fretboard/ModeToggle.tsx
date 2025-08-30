import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type ModeToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ModeToggle({ label, checked, onChange }: ModeToggleProps) {
  const id = label.replace(/\s+/g, "-").toLowerCase()

	return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
		</div>
  )
}
