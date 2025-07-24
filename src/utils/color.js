const getColorShades = color => {
  const NUM_SHADES = 7
  const SHADE_BASE = 3
  const SHADE_STEP = 1

  return Array.from({ length: NUM_SHADES }, (_, i) => 
    `var(--mantine-color-${color}-${SHADE_BASE + (i * SHADE_STEP)})`
  )
}

export const PRIMARY_COLOR = 'green'

export const CHART_COLORS = [
  ...getColorShades(PRIMARY_COLOR),
  ...getColorShades('red'),
  ...getColorShades('blue'),
  ...getColorShades('pink'),
]