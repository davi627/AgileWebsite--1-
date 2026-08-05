import Logo from '../../assets/Agile Logo.png'

// Social icons
import fBIcon from '../../assets/socials/fb.png'
import twitterIcon from '../../assets/socials/twitter.png'
import instaIcon from '../../assets/insta logo.png'
import liIcon from '../../assets/socials/linkedin.png'
import TiktockIcon from '../../assets/socials/TikTok.png'
import YoutubeIcon from '../../assets/socials/Youtube.png'

const navigation = {
  company: [
    { name: 'About Us', href: '/about-us' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Careers', href: 'https://careers.agilebiz.co.ke' },
    { name: 'Partners', href: '#partners' },
    { name: 'Privacy Policy', href: '/privacy-policy-2' },
    {
      name: 'Quality and Security Policies',
      href: '/quality-security-policy'
    }
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
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@agilebizsolutions?_t=ZM-8yeRpKlHHS4&_r=1',
      icon: TiktockIcon
    },
    {
      name: 'Youtube',
      href: 'https://www.youtube.com/channel/UCM1rte4MuBqA8tqS0hjWeiA',
      icon: YoutubeIcon
    }
  ]
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#f0f0f0] text-[#000] ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 4xl:ml-[140px] lg:ml-24">
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 sm:gap-8" style={{ fontFamily: 'Poppins', fontSize: '14px', lineHeight: '30px', fontWeight: 400 }}>
          {/* First Column - Company Info (Takes up 5 columns) */}
          <div className="col-span-12 lg:col-span-5">
            <img src={Logo} alt="Agile Business Solutions" className="h-10 mb-4" />
            <div className="text-gray-700 leading-relaxed space-y-0">
              <p>Agile Business Solutions</p>
              <p>is proudly a Kenyan technology powerhouse</p>
              <p>at the forefront of Africa's digital revolution.</p>
            </div>
          </div>

          {/* Second and Third Columns Container (Takes up 7 columns, closer together) */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Second Column - Quick Links */}
            <div>
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

            {/* Third Column - Contact Info */}
            <div>
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

        {/* Social Icons - Positioned to align with Quick Links column */}
        <div className="mt-2 sm:mt-4 grid grid-cols-12">
          <div className="col-span-12 lg:col-span-5"></div>
          <div className="col-span-12 lg:col-span-7">
            <div className="flex justify-start space-x-4">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 border-t border-gray-300 pt-8 text-center text-sm text-gray-600">
          © {currentYear} Agile Business Solutions Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
