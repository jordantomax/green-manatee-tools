import { useState, useEffect, useRef, useCallback, Children, cloneElement } from 'react'
import { ScrollArea, Table } from '@mantine/core'
import throttle from 'lodash-es/throttle'

import styles from '@/styles/StickyHeaderTable.module.css'

function StickyHeaderTable({ 
  children, 
  numStickyColumns = 1,
  theadRef,
}) {
  if (!theadRef) {
    throw new Error('StickyHeaderTable: theadRef is required')
  }

  const stickyHeaderRef = useRef(null)
  const scrollAreaRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  
  const handleYScroll = useCallback(
    throttle(() => {
      if (theadRef.current) {
        const shouldStick = theadRef.current.getBoundingClientRect().top <= 0
        setIsSticky(shouldStick)
      }
    }, 16), 
    []
  )

  const handleXScroll = ({x, y}) => {
    if (stickyHeaderRef.current) {
      const tr = stickyHeaderRef.current.querySelector('tr')
      if (tr) {
        tr.style.transform = `translateX(-${x}px)`
        
        // Apply transform to first N sticky columns
        for (let i = 0; i < numStickyColumns; i++) {
          const stickyTh = tr.querySelector(`th:nth-child(${i + 1})`)
          if (stickyTh) {
            stickyTh.style.transform = `translateX(${x}px)`
          }
        }
      }
    }
  }

  const syncStickyHeader = useCallback(() => {
    if (isSticky && theadRef.current && stickyHeaderRef.current) {
      const visibleThs = theadRef.current.querySelectorAll('th')
      const stickyThs = stickyHeaderRef.current.querySelectorAll('th')
      
      visibleThs.forEach((th, index) => {
        if (stickyThs[index]) {
          stickyThs[index].style.width = `${th.offsetWidth}px`
        }
      })
      
      // Sync table width and position
      const scrollArea = scrollAreaRef.current
      const stickyTable = stickyHeaderRef.current
      
      if (scrollArea && stickyTable) {
        // Set sticky table width to match main table
        stickyTable.style.width = `${scrollArea.offsetWidth}px`
        
        // Set left position to match main table's position from viewport
        const scrollAreaRect = scrollArea.getBoundingClientRect()
        stickyTable.style.left = `${scrollAreaRect.left}px`
      }
    }
  }, [isSticky])
  
  useEffect(() => {
    window.addEventListener('scroll', handleYScroll, { passive: true })
    window.addEventListener('resize', syncStickyHeader, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleYScroll)
      window.removeEventListener('resize', syncStickyHeader)
    }
  }, [handleYScroll, syncStickyHeader])

  useEffect(() => {
    syncStickyHeader()
  }, [syncStickyHeader])
  
  const tableChild =  Children.toArray(children).find(child => 
    child?.type === Table
  )

  const theadChild = Children.toArray(tableChild?.props?.children || []).find(child =>
    child?.type === Table.Thead
  )

  if (!tableChild || !theadChild) {
    console.warn('StickyHeaderTable requires Table and Table.Thead as children')
    return children
  }
  
  const stickyThead = cloneElement(theadChild, {
    children: Children.map(theadChild.props.children, trChild => 
      cloneElement(trChild, {
        children: Children.map(trChild.props.children, (thChild, colIdx) =>
          cloneElement(thChild, {
            className: [thChild.props.className, colIdx < numStickyColumns && styles.stickyHeaderStickyCol].filter(Boolean).join(' '),
            key: thChild.key || colIdx
          })
        )
      })
    )
  })

  return (
    <>
      <Table 
        size="sm"
        ref={stickyHeaderRef} 
        className={`${styles.stickyHeaderTable} ${isSticky ? styles.stuck : ''}`}
      >
        {stickyThead}
      </Table>

      <ScrollArea 
        ref={scrollAreaRef}
        onScrollPositionChange={handleXScroll} 
        type="native"
      >
        {children}
      </ScrollArea>
    </>
  )
}

export default StickyHeaderTable