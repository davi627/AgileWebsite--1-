import Logo from '../../assets/Agile Logo.png'

// Social icons
import fBIcon from '../../assets/socials/fb.png'
import twitterIcon from '../../assets/socials/twitter.png'
import instaIcon from '../../assets/insta logo.png'
import liIcon from '../../assets/socials/linkedin.png'

const navigation = {
  company: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Careers', href: 'https://careers.agilebiz.co.ke' },
    { name: 'Partners', href: '#partners' }
  ],
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/10384226/',
      icon: liIcon
    },
    {
      name: 'X',
      href: 'https://x.com/AgilebizKE',
      icon: twitterIcon
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/agilebizKE',
      icon: fBIcon
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/agilebizsolutions/',
      icon: instaIcon
    }
  ]
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#f0f0f0] text-[#000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 justify-between" style={{ fontFamily: 'Poppins', fontSize: '14px', lineHeight: '30px', fontWeight: 400 }}>
          {/* First Column (About Us) - Aligned Left */}
          <div className="w-full md:w-1/3">
            <img src={Logo} alt="Agile Business Solutions" className="h-10 mb-4" />
            <p>Agile Business Solutions</p>
            <p>is proudly a Kenyan technology powerhouse</p>
            <p>at the forefront of Africa's digital revolution.</p>
          </div>

          {/* Container for Quick Links and Contact Us */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-2/3">
            {/* Second Column (Quick Links) */}
            <div className="w-full md:w-1/2">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="hover:underline transition duration-150 ease-in-out"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Third Column (Contact Us) */}
            <div className="w-full md:w-1/2">
              <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
              <div className="space-y-2">
                <p>Phone: +254 723 929 999</p>
                <p>Email: info@agilebiz.co.ke</p>
                <p>Email: sales@agilebiz.co.ke</p>
                <div className="pt-2">
                  <p className="font-medium">Address:</p>
                  <p>1st Floor, Jumuia Place II,</p>
                  <p>Lenana Rd., Nairobi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons - Aligned Right Below Quick Links and Contact Us */}
        <div className="flex justify-end space-x-4 mt-4 md:mr-[calc(33.333%+0.5rem)]">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${item.name}`}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white transition-all hover:bg-gray-200"
            >
              <img src={item.icon} alt={item.name} className="h-5 w-5" style={{ filter: 'grayscale(100%) brightness(0%)' }} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-600">
          © {currentYear} Agile Business Solutions Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
