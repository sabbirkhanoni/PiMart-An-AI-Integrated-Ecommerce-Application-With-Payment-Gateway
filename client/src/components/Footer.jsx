import { FaFacebook, FaInstagram, FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto py-16 px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                PiMart
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Elevating your digital commerce experience with innovative solutions and unparalleled service excellence.
            </p>
            <div className="flex items-center space-x-6 pt-4">
              {[
                { icon: FaFacebook, label: "Facebook" },
                { icon: FaSquareXTwitter, label: "Twitter" },
                { icon: FaInstagram, label: "Instagram" },
                { icon: FaLinkedin, label: "LinkedIn" }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transform hover:scale-110 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'About Us', 'Products', 'Services', 'Portfolio',
                'Contact', 'Careers', 'Blog', 'Support'
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1 transform block"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600">1124 Market Street</p>
                  <p className="text-gray-600">Dhaka,Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <a href="mailto:support@pimart.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    support@pimart.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-600 text-sm">
                © {currentYear} PiMart. All Rights Reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Privacy Policy</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms of Service</a>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              PiMart
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;