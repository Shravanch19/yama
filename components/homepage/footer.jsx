import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-4 text-center">
            <span>
                © {new Date().getFullYear()} Yama. All rights reserved. | Built with <span className="text-blue-400">React</span> &amp; <span className="text-blue-500">Tailwind CSS</span>
            </span>
        </footer>
    )
}

export default Footer