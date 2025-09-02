import { Group, Popover } from "@mantine/core"
import { DatePicker, DateInput } from "@mantine/dates"
import { IconArrowRight, IconCalendarFilled } from '@tabler/icons-react'
import { dateRangePresets } from '@/utils/date'

import styles from '@/styles/DateRangeInputPicker.module.css'


function DateRangeInputPicker({ 
  value, 
  onChange
}) {
  return (
    <Popover position="bottom-start">
      <Popover.Target>
        <Group gap="0" className={styles.inputGroup}>
          <Group pl="xs"><IconCalendarFilled size={21} /></Group>
          <DateInput
            variant="unstyled"
            size="sm"
            px="xs"
            placeholder="Start Date"
            value={value.startDate}
            onChange={(date) => onChange({ ...value, startDate: date })}
            popoverProps={{ disabled: true }}
            valueFormat="M/D/YYYY"
            className={styles.input}
          />
          <IconArrowRight size={16} />
          <DateInput
            variant="unstyled"
            size="sm"
            px="xs"
            placeholder="End Date"
            value={value.endDate}
            onChange={(date) => onChange({ ...value, endDate: date })}
            popoverProps={{ disabled: true }}
            valueFormat="M/D/YYYY"
            className={styles.input}
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

export default DateRangeInputPicker
