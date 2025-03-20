export interface Block {
  type: string
  props: {
    [key: string]: unknown
  }
}

export interface HeroBlock {
  title: string
  subtitle: string
  backgroundImage: string
}

export interface ContentBlock {
  heading: string
  content: string
}

export interface ServicesBlock {
  services: Service[]
}

export interface StatsBlock {
  stats: { label: string; value: string }[]
}

export interface CallToActionBlock {
  message: string
  buttonLabel: string
  buttonUrl: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface FAQsBlock {
  faqs: FAQ[]
}

export interface Service {
  title: string
  description: string
  image: string
}
