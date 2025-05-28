import React, { Fragment, useState, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { sendMail } from '../../services/MailService'
import {
  renderQuotationEmailText,
  renderQuotationEmailHtml
} from '../../templates/emails/QuotationEmail'

interface GetQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  enquiryType?: string
}

const GetQuoteModal: React.FC<GetQuoteModalProps> = ({
  isOpen,
  onClose,
  enquiryType
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const mailProps = {
        serviceName: enquiryType || 'N/A',
        name,
        email,
        phone,
        message
      }

      await sendMail({
        to: 'hello@skyver.co.ke',
        subject: `Quote Request from ${name}`,
        text: renderQuotationEmailText(mailProps),
        html: renderQuotationEmailHtml(mailProps)
      })
      onClose()
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Request a Quote
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Please fill in the form below to request a quote.
                  </p>
                </div>

                <form className="mt-4" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary-dark focus-visible:ring-primary inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default GetQuoteModal
