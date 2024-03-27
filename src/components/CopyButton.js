import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'

function CopyButton ({ text, ...props }) {
  const [copied, setCopied] = useState(false)

  function handleCopy () {
    setCopied(true)
    setTimeout(setCopied, 1500, false)
  }

  return (
    <CopyToClipboard
      text={text}
      onCopy={handleCopy}
      {...props}
    >
      <Button>{copied ? 'Copied!' : 'Copy'}</Button>
    </CopyToClipboard>
  )
}

export default CopyButton
