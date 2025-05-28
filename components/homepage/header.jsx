import React from 'react'

const Header = () => {
    return (
        <header className="bg-gray-900 text-white py-4 h-[30vh] flex items-center justify-center relative overflow-hidden shadow-lg mb-2">
            <img
                src="https://motionbgs.com/media/2621/night-study-on-the-balcony.jpg"
                alt="Night study on the balcony"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold mb-2">Bhai! Aur Nahi</h1>
                <p className="text-lg">Ab Phodna Hai!</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
        </header>
    )
}

export default Header