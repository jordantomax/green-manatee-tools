import React from 'react'
import { Stack, TextInput, Group, Title, Button, Paper, Grid } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import capitalize from 'lodash-es/capitalize'
import startCase from 'lodash-es/startCase'

function ItemGroup ({
  name,
  items,
  factory,
  handleChange,
  columns = 2
}) {
  function handleItemCreate () {
    const newItem = factory()
    const update = [...(items || []), newItem]
    handleChange(update)
  }

  function handleItemDelete (i) {
    const update = [...items]
    update.splice(i, 1)
    handleChange(update)
  }

  function handleItemChange (i, e) {
    const update = [...items]
    const { name, value } = e.target
    update[i] = { ...update[i], [name]: value }
    handleChange(update)
  }

  const columnSpan = {
    base: 12,
    sm: 12 / columns
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3} style={{ margin: 0 }}>{capitalize(name)}s</Title>
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={handleItemCreate} 
          variant="light"
        >
          Add {capitalize(name)}
        </Button>
      </Group>

      {(items || []).map((item, itemIndex) => {
        return (
          <Paper key={item.id} p="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={4} style={{ margin: 0 }}>{capitalize(name)} {itemIndex + 1}</Title>
                <Button 
                  variant="subtle" 
                  color="red" 
                  onClick={() => handleItemDelete(itemIndex)}
                  leftSection={<IconTrash size={16} />}
                >
                  Delete
                </Button>
              </Group>

              <Grid>
                {Object.entries(item)
                  .filter(([key]) => key !== 'id')
                  .map(([key, value]) => {
                    return (
                      <Grid.Col key={`${item.id}-${key}`} span={columnSpan}>
                        <TextInput
                          label={startCase(key)}
                          placeholder={`Enter ${startCase(key).toLowerCase()}`}
                          defaultValue={value}
                          onChange={e => handleItemChange(itemIndex, e)}
                          name={key}
                        />
                      </Grid.Col>
                    )
                  })}
              </Grid>
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}

export default ItemGroup
