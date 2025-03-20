import React from 'react'

interface QuotationEmailProps {
  serviceName: string
  name: string
  email: string
  phone: string
  message: string
}

const QuotationEmail: React.FC<QuotationEmailProps> = ({
  serviceName,
  name,
  email,
  phone,
  message
}) => {
  return (
    <div>
      <table style={styles.table as React.CSSProperties}>
        <tbody>
          <tr>
            <td style={styles.header as React.CSSProperties}>
              <h1 style={styles.headerText as React.CSSProperties}>
                Agile Business Solutions
              </h1>
            </td>
          </tr>
          <tr>
            <td style={styles.content as React.CSSProperties}>
              <p>Hello Team,</p>
              <p>Good news 🎉 We have received a new quote request!</p>
              <p>
                <strong style={styles.highlight as React.CSSProperties}>
                  {name}
                </strong>{' '}
                from
                <strong style={styles.highlight as React.CSSProperties}>
                  {' '}
                  Company A
                </strong>{' '}
                is interested in our
                <strong style={styles.highlight as React.CSSProperties}>
                  {' '}
                  {serviceName}
                </strong>{' '}
                services. You can reach out to them through the following
                contact details:
              </p>
              <p>
                <strong style={styles.highlight as React.CSSProperties}>
                  Email:
                </strong>{' '}
                {email}
              </p>
              <p>
                <strong style={styles.highlight as React.CSSProperties}>
                  Phone:
                </strong>{' '}
                {phone}
              </p>
              <p>
                <strong style={styles.highlight as React.CSSProperties}>
                  Message:
                </strong>{' '}
                {message}
              </p>
              <p>
                Let us get in touch with them soon and showcase how we can
                assist with their needs.
              </p>
              <p>Best regards,</p>
              <p>Agile Business Solutions Team</p>
            </td>
          </tr>
          <tr>
            <td style={styles.footer as React.CSSProperties}>
              <p style={styles.footerText as React.CSSProperties}>
                Agile Business Solutions, 1st Floor, Jumuia Place II, Lenana Rd,
                Nairobi, Kenya
              </p>
              <p style={styles.footerText as React.CSSProperties}>
                <a
                  href="https://www.agilebiz.co.ke"
                  style={styles.link as React.CSSProperties}
                >
                  www.agilebiz.co.ke
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  table: {
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    border: '1px solid #eaeaea',
    borderRadius: '5px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#006591',
    padding: '20px',
    textAlign: 'center' as const, // Explicitly setting the type to one of the allowed values
    borderBottom: '1px solid #eaeaea'
  },
  headerText: {
    margin: '0',
    fontSize: '20px',
    color: '#ffffff'
  },
  content: {
    padding: '10px',
    fontSize: '14px',
    color: '#333'
  },
  highlight: {
    color: '#006591'
  },
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'center' as const, // Explicitly setting the type to one of the allowed values
    borderTop: '1px solid #eaeaea'
  },
  footerText: {
    margin: '0',
    fontSize: '10px',
    color: '#777'
  },
  link: {
    color: '#006591',
    textDecoration: 'none'
  }
}

export const renderQuotationEmailText = (props: QuotationEmailProps) => `
Hello Team,

Good news 🎉 We have received a new quote request!

${props.name} is interested in our ${
  props.serviceName || 'General Enquiry'
} services. You can reach out to them through the following contact details:

Email: ${props.email}
Phone: ${props.phone}
Message: ${props.message}

Let's get in touch with them soon and showcase how we can assist with their needs.

Best regards,
Agile Business Solutions Team
`

export const renderQuotationEmailHtml = (props: QuotationEmailProps) => `
<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <table style="width: 100%; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 5px;">
    <tr>
      <td style="background-color: #006591; padding: 20px; text-align: center; border-bottom: 1px solid #eaeaea;">
        <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Agile Business Solutions</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px; font-size: 14px; color: #333;">
        <p>Hello Team,</p>
        <p>Good news 🎉 We have received a new quote request!</p>
        <p><strong style="color: #006591;">${props.name}</strong> is interested in our <strong style="color: #006591;">${props.serviceName}</strong> services. You can reach out to them through the following contact details:</p>
        <p><strong style="color: #006591;">Email:</strong> ${props.email}</p>
        <p><strong style="color: #006591;">Phone:</strong> ${props.phone}</p>
        <p><strong style="color: #006591;">Message:</strong> ${props.message}</p>
        <p>Let's get in touch with them soon and showcase how we can assist with their needs.</p>
        <p>Best regards,</p>
        <p>Agile Business Solutions Team</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f5f5f5; padding: 10px; text-align: center; border-top: 1px solid #eaeaea;">
        <p style="margin: 0; font-size: 10px; color: #777;">Agile Business Solutions, 1st Floor, Jumuia Place II, Lenana Rd, Nairobi, Kenya</p>
        <p style="margin: 0; font-size: 10px; color: #777;">
          <a href="https://www.agilebiz.co.ke" style="color: #006591; text-decoration: none;">www.agilebiz.co.ke</a>
        </p>
      </td>
    </tr>
  </table>
</div>
`

export default QuotationEmail
