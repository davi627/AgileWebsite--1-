// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SidePadding({ children }: { children: any }) {
  return <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">{children}</div>
}

export default SidePadding
