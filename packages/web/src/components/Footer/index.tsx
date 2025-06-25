import Logo from '../../assets/agilebiz_logo2.png'
import cert1 from '../../assets/iso27001.png'
import cert2 from '../../assets/iso9001.png'

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
    { name: 'Partners', href: '/patners' }
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
  return (
    <footer className="bg-primary py-10 text-white font-Poppins text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10 lg:grid lg:grid-cols-4">
        {/* Logo & Description */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
          <img className="h-12 w-auto" src={Logo} alt="Agilebiz Logo" />
          <p className="text-sm font-light text-gray-100">
            Agile Business Solutions is proudly a Kenyan technology powerhouse at the forefront of Africa's digital revolution.
          </p>
          <div className="flex gap-4">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center">
                  <img src={item.icon} alt={item.name} className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-white font-semibold">Company</h3>
          <div className="flex flex-col gap-1 text-gray-100 text-sm">
            {navigation.company.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center lg:items-start gap-3 text-gray-100 text-sm text-center lg:text-left">
          <h3 className="text-white font-semibold">Contact Us</h3>
          <p><span className="font-medium">Phone:</span> +254 712 345 678</p>
          <p><span className="font-medium">Email:</span> info@agilebiz.co.ke</p>
          <p><span className="font-medium">Email:</span> sales@agilebiz.co.ke</p>
          <p>
            <span className="font-medium">Address:</span><br />
            1st Floor, Jumuia Place II,<br />
            Lenana Rd., Nairobi
          </p>
        </div>

        {/* Certifications side-by-side */}
        <div className="flex flex-col items-center lg:items-end justify-end">
          <div className="flex gap-4">
            <img
              src={cert1}
              alt="ISO 27001"
              className="h-20 w-auto"
            />
            <img
              src={cert2}
              alt="ISO 9001"
              className="h-20 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-white/20 pt-4 text-center text-xs text-gray-300">
        &copy; 2025 Agile Business Solutions Ltd. All rights reserved.
      </div>
    </footer>
  )
}
