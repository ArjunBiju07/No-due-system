import React from "react";

function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
                <p className="mb-1">&copy; {new Date().getFullYear()} No Due Clearance System</p>
                <small>Developed by Arjun Biju</small>
            </div>
        </footer>
    );
}

export default Footer;
