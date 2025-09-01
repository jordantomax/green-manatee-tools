import { Group, Popover } from "@mantine/core"
import { DatePicker, DateInput } from "@mantine/dates"
import { dateRangePresets } from '@/utils/date'

function DateRangePicker({ 
  value, 
  onChange
}) {
  return (
    <Popover position="bottom-start">
      <Popover.Target>
        <Group gap="xs" align="flex-end">
          <DateInput
            placeholder="Start date"
            value={value.startDate}
            onChange={(date) => onChange({ ...value, startDate: date })}
            popoverProps={{ disabled: true }}
            style={{ minWidth: 120 }}
          />
          <DateInput
            placeholder="End date"
            value={value.endDate}
            onChange={(date) => onChange({ ...value, endDate: date })}
            popoverProps={{ disabled: true }}
            style={{ minWidth: 120 }}
          />
        </Group>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker 
          size="xs"
          type="range" 
          numberOfColumns={2} 
          value={[value.startDate, value.endDate]}
          onChange={(range) => {
            onChange({
              startDate: range?.[0] || null,
              endDate: range?.[1] || null
            })
          }}
          presets={dateRangePresets}
        />
      </Popover.Dropdown>
    </Popover>
  )
}

export default DateRangePicker
