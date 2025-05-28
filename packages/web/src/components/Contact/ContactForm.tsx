import React, { useState } from 'react'
import { sendMail } from '../../services/MailService'

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setIsSent(false)

    try {
      await sendMail({
        to: 'sales@agilebiz.co.ke',
        subject: `New message from ${formData.name}`,
        text: formData.message,
        html: `<p>${formData.message}</p><p>From: ${formData.name} (${formData.email})</p>`
      })
      setIsSent(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
      <div>
        <h2 className="text-primary text-3xl font-bold tracking-tight">
          Send us a message
        </h2>
        <p className="mt-4 leading-7 text-gray-600">
          We&apos;d love to hear from you. Please fill out the form below and
          we&apos;ll get in touch with you shortly.
        </p>
      </div>
      <div className="lg:col-span-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-gray-50 p-10"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
          {isSent && (
            <p className="mt-4 text-green-600">
              Your message has been sent successfully!
            </p>
          )}
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default ContactForm
