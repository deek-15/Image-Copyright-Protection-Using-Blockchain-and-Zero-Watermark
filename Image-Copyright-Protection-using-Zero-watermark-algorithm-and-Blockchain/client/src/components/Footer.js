import React from 'react'
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <>
            <div className="container-flex d-flex flex-row justify-content-between bg-dark text-light py-3">
                <div className="d-flex align-items-center">
                    <img src="Logo-alone-removebg-preview.png" alt="" height="60" />
                    <span>
                        &#169; 2022 PIC STOCK
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <InstagramIcon />
                    <TwitterIcon />
                    <LinkedInIcon />
                </div>
            </div>

        </>
    )
}

export default Footer