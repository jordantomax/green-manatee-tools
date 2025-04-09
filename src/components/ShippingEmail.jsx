import { useState } from 'react'
import { Button } from '@mantine/core'

function ShippingEmail ({ shipments }) {
    const [isWritingEmail, setIsWritingEmail] = useState(false)

    async function writeEmail (shipments) {
        console.log(shipments)
    }

    return (
        <Button
            disabled={shipments.length === 0}
            loading={isWritingEmail}
            onClick={async () => {
                setIsWritingEmail(true)

                try {
                    await writeEmail(shipments)
                } catch (error) {
                    console.error('Error writing email:', error)
                } finally {
                    setIsWritingEmail(false)
                }
            }}
        >
            Write Email
        </Button>
    )
}

export default ShippingEmail