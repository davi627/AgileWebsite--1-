import SolnIcon from '../../assets/soln-icon.png'

const ProductCard = ({
  name,
  description,
  // icon: Icon,
  slug
}: {
  name: string
  description: string
  // icon: React.ElementType
  slug: string
}) => (
  <div
    id="products-section"
    className="flex flex-col rounded-lg  p-6 hover:bg-sky-50"
  >
    {/* {Icon ? <Icon className="text-alternate mb-4 size-8" /> : null} */}
    <img src={SolnIcon} alt="icon" className="mb-4 size-8 md:size-14" />
    <a
      className="mb-2 text-xl font-medium hover:underline md:text-2xl"
      href={`/${slug}`}
    >
      {name}
    </a>
    <p className="mb-4 text-base font-light">{description}</p>
    <a href={`/${slug}`} className="text-primary mt-auto hover:text-opacity-75">
      Explore &rarr;
    </a>
  </div>
)

export default ProductCard
