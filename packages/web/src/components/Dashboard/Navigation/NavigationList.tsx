import React from 'react'
import NavigationItem from './NavigationItem'

interface NavigationItemData {
  name: string
  href: string
  icon: React.ElementType
}

interface NavigationListProps {
  items: NavigationItemData[]
}

const NavigationList: React.FC<NavigationListProps> = ({ items }) => {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {items.map((item) => (
        <NavigationItem
          key={item.name}
          name={item.name}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </ul>
  )
}

export default NavigationList
