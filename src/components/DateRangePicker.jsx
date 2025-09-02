import { Group, Popover, Paper } from "@mantine/core"
import { DatePicker, DateInput } from "@mantine/dates"
import { IconChevronRight } from '@tabler/icons-react'
import { dateRangePresets } from '@/utils/date'


function DateRangePicker({ 
  value, 
  onChange
}) {
  return (
    <Popover position="bottom-start">
      <Popover.Target>
        <Paper p="0">
          <Group 
            gap="0" 
            style={{ 
              flexWrap: 'nowrap', 
              overflow: 'hidden', 
              width: 250
            }}
          >
            <DateInput
              size="sm"
              variant="unstyled"
              placeholder="Start Date"
              value={value.startDate}
              onChange={(date) => onChange({ ...value, startDate: date })}
              popoverProps={{ disabled: true }}
              px="xs"
              valueFormat="M/D/YYYY"
              styles={{ input: { fieldSizing: 'content' } }}
            />
            <IconChevronRight size={16} />
            <DateInput
              size="sm"
              variant="unstyled"
              placeholder="End Date"
              value={value.endDate}
              onChange={(date) => onChange({ ...value, endDate: date })}
              popoverProps={{ disabled: true }}
              px="xs"
              valueFormat="M/D/YYYY"
              styles={{ input: { fieldSizing: 'content' } }}
            />
          </Group>
        </Paper>
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
