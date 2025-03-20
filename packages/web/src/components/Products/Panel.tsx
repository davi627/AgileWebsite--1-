import React from 'react'
import { Disclosure, Tab } from '@headlessui/react'
import ProductItem from './ProductItems'

interface Category {
  category: string
  items: { name: string; image: string; description: string }[]
}

interface ProductPanelProps {
  category: Category
  openDisclosure: number | null
  onDisclosureToggle: (index: number) => void
}

const ProductPanel: React.FC<ProductPanelProps> = ({
  category,
  openDisclosure,
  onDisclosureToggle
}) => {
  return (
    <Tab.Panel className="w-full">
      <div className="flex flex-col space-y-2">
        {category.items.map((item, productIndex) => (
          <Disclosure key={item.name} as="div" className="w-full">
            {() => (
              <>
                <ProductItem
                  item={item}
                  index={productIndex}
                  openDisclosure={openDisclosure}
                  onDisclosureToggle={onDisclosureToggle}
                />
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </Tab.Panel>
  )
}

export default ProductPanel
