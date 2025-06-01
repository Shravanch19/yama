import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-4 text-center">
            <span>
                © {new Date().getFullYear()} Yama. All rights reserved.
            </span>
        </footer>
    )
}

export default Footer