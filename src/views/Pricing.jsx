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

import { useLocalStorage } from '@/hooks/useLocalStorage'

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
  const [values, setValue] = useLocalStorage('pricing-calculator', {
    costOfGoods: 0,
    lowSalePrice: 0,
    highSalePrice: 0,
    referralFee: 15,
    fbaFee: 3,
    steps: 15
  })

  const scenarios = generatePricingScenarios(values)
  
  return (
    <Container>
      <Paper p="md">
        <Title order={2}>Pricing Calculator</Title>
        
        <Stack gap="md" mt="md">
          <Group>
            <NumberInput
              label="Low Sale Price"
              value={values.lowSalePrice}
              onChange={(value) => setValue('lowSalePrice', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="High Sale Price"
              value={values.highSalePrice}
              onChange={(value) => setValue('highSalePrice', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Cost of Goods"
              value={values.costOfGoods}
              onChange={(value) => setValue('costOfGoods', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Referral Fee (%)"
              value={values.referralFee}
              onChange={(value) => setValue('referralFee', value)}
              suffix="%"
              decimalScale={1}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="FBA Fee"
              value={values.fbaFee}
              onChange={(value) => setValue('fbaFee', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="steps"
              value={values.steps}
              onChange={(value) => setValue('steps', value)}
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