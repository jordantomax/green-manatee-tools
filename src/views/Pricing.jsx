import React from 'react'
import {
  Container,
  Title,
  Paper,
  NumberInput,
  Stack,
  Group,
  Table,
  Text,
} from '@mantine/core'

import usePersistentState from '@/hooks/usePersistentState'

const generatePricingScenarios = ({
  costOfGoods,
  lowSalePrice,
  highSalePrice,
  referralFee,
  fbaFee,
  steps
}) => {

  if (!costOfGoods || !lowSalePrice || !highSalePrice) return []
  
  const scenarios = []
  
  for (let i = 0; i < steps; i++) {
    const price = lowSalePrice + (i * ((highSalePrice - lowSalePrice) / (steps - 1)))
    
    const referralFeeAmount = (price * referralFee) / 100
    const totalFees = referralFeeAmount + fbaFee
    const profit = price - costOfGoods - totalFees
    const profitMargin = price > 0 ? (profit / price) * 100 : 0
    const roi = costOfGoods > 0 ? (profit / costOfGoods) * 100 : 0
    
    scenarios.push({
      salePrice: price,
      costOfGoods,
      referralFee: referralFeeAmount,
      fbaFee,
      profit,
      profitMargin,
      roi
    })
  }
  
  return scenarios
}

function Pricing() {
  const [settings, setSetting] = usePersistentState('pricingCalculator', {
    costOfGoods: 0,
    lowSalePrice: 0,
    highSalePrice: 0,
    referralFee: 15,
    fbaFee: 3,
    steps: 15
  })

  const scenarios = generatePricingScenarios(settings)
  
  return (
    <Container>
      <Paper p="md">
        <Title order={2}>Pricing Calculator</Title>
        
        <Stack gap="md" mt="md">
          <Group>
            <NumberInput
              label="Low Sale Price"
              value={settings.lowSalePrice}
              onChange={(value) => setSetting({ ...settings, lowSalePrice: Number(value) })}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="High Sale Price"
              value={settings.highSalePrice}
              onChange={(value) => setSetting({ ...settings, highSalePrice: Number(value) })}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Cost of Goods"
              value={settings.costOfGoods}
              onChange={(value) => setSetting({ ...settings, costOfGoods: Number(value) })}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Referral Fee (%)"
              value={settings.referralFee}
              onChange={(value) => setSetting({ ...settings, referralFee: Number(value) })}
              suffix="%"
              decimalScale={1}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="FBA Fee"
              value={settings.fbaFee}
              onChange={(value) => setSetting({ ...settings, fbaFee: Number(value) })}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="steps"
              value={settings.steps}
              onChange={(value) => setSetting({ ...settings, steps: Number(value) })}
              min={2}
              max={50}
              style={{ maxWidth: 150 }}
            />
          </Group>

          {scenarios.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  {[
                    'Sale Price',
                    'Cost of Goods',
                    'Referral Fee', 
                    'FBA Fee',
                    'Profit',
                    'Profit Margin',
                    'ROI'
                  ].map((header, index) => (
                    <Table.Th key={index} style={{ width: `${100 / 6}%` }}>
                      {header}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {scenarios.map((scenario, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>${scenario.salePrice.toFixed(2)}</Table.Td>
                    <Table.Td>${scenario.costOfGoods.toFixed(2)}</Table.Td>
                    <Table.Td>${scenario.referralFee.toFixed(2)}</Table.Td>
                    <Table.Td>${scenario.fbaFee.toFixed(2)}</Table.Td>
                    <Table.Td style={{ color: scenario.profit >= 0 ? 'green' : 'red' }}>
                      ${scenario.profit.toFixed(2)}
                    </Table.Td>
                    <Table.Td style={{ color: scenario.profitMargin >= 0 ? 'green' : 'red' }}>
                      {scenario.profitMargin.toFixed(1)}%
                    </Table.Td>
                    <Table.Td style={{ color: scenario.roi >= 0 ? 'green' : 'red' }}>
                      {scenario.roi.toFixed(1)}%
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text c="dimmed" ta="center" py="xl">
              Add inputs to generate pricing scenarios
            </Text>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default Pricing 