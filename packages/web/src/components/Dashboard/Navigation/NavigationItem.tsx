import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavigationItemProps {
  name: string
  href: string
  icon: React.ElementType
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  href,
  icon: Icon
}) => {
  const location = useLocation()

  return (
    <li>
      <Link
        to={href}
        className={classNames(
          location.pathname.startsWith(href)
            ? 'bg-gray-50 text-primary'
            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
        )}
      >
        <Icon
          className={classNames(
            location.pathname.startsWith(href)
              ? 'text-primary'
              : 'text-gray-400 group-hover:text-primary',
            'h-6 w-6 shrink-0'
          )}
          aria-hidden="true"
        />
        {name}
      </Link>
    </li>
  )
}

export default NavigationItem
