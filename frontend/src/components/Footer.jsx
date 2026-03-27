import React from 'react';


const Footer = () => {
    return (
        <footer className="w-full bg-[#020617] border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="flex items-center gap-2 mb-6 text-slate-400 group">
                    <span className="text-sm font-medium">Developed by</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl text-center">
                    <div>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">Arjun Biju</p>
                    </div>
                    <div>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">Harikrishnan KR</p>
                    </div>
                    <div>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">Anson K Regi</p>
                    </div>
                    <div>
                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors">Steny Geo Francis</p>
                    </div>
                </div>
                <br />
                <div >
                    <p className="text-slate-500 text-xs tracking-widest uppercase font-bold">
                        &copy; {new Date().getFullYear()} No Due Clearance System | GPTC Purapuzha
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
