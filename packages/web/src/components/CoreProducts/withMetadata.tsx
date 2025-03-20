import React from 'react'

interface ChildComponentProps {
  id: number
  title: string
  description: string
}

const withMetadata = (
  Component: React.ComponentType,
  metadata: ChildComponentProps
) => {
  const WrappedComponent = () => (
    <div>
      <Component />
    </div>
  )

  WrappedComponent.id = metadata.id
  WrappedComponent.title = metadata.title
  WrappedComponent.description = metadata.description

  return WrappedComponent
}

export default withMetadata
