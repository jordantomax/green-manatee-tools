import React from 'react'
import {
  Container,
  Title,
  Paper,
  Text,
  TextInput,
  NumberInput,
  Stack,
  Group,
} from '@mantine/core'

import { useLocalStorage } from '@/hooks/useLocalStorage'

function Pricing() {
  const [values, setValues] = useLocalStorage('pricing-calculator', {
    costOfGoods: 0,
    salePrice: 0,
    referralFee: 15,
    fbaFee: 30,
    additionalCosts: 0
  })
  const { costOfGoods, salePrice, referralFee, fbaFee, additionalCosts } = values

  const referralFeeAmount = (salePrice * referralFee) / 100
  const totalFees = referralFeeAmount + fbaFee
  const totalCosts = costOfGoods + additionalCosts
  const profit = salePrice - totalCosts - totalFees
  const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0
  const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0

  return (
    <Container>
      <Paper p="md">
        <Title order={2}>Pricing Calculator</Title>
        
        <Stack gap="md" mt="md">
          <Group>
            <NumberInput
              label="Cost of Goods"
              value={costOfGoods}
              onChange={(value) => setValues('costOfGoods', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Additional Costs"
              value={additionalCosts}
              onChange={(value) => setValues('additionalCosts', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Sale Price"
              value={salePrice}
              onChange={(value) => setValues('salePrice', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="Referral Fee (%)"
              value={referralFee}
              onChange={(value) => setValues('referralFee', value)}
              suffix="%"
              decimalScale={1}
              style={{ maxWidth: 150 }}
            />
            <NumberInput
              label="FBA Fee"
              value={fbaFee}
              onChange={(value) => setValues('fbaFee', value)}
              prefix="$"
              decimalScale={2}
              style={{ maxWidth: 150 }}
            />
          </Group>

          <Stack gap="xs">
            <Text>Profit: ${profit.toFixed(2)}</Text>
            <Text>Profit Margin: {profitMargin.toFixed(1)}%</Text>
            <Text>ROI: {roi.toFixed(1)}%</Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}

export default Pricing 