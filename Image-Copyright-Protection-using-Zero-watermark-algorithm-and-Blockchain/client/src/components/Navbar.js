import React from 'react';
// import styles from './Navbar.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

const Navbar = (props) => {
    return (
        <nav className="navbar navbar-dark bg-dark sticky-top">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <div className='d-flex flex-row align-items-center navbar-brand'>
                        <img src="Logo-alone-removebg-preview.png" alt="" height="60" className="d-inline-block align-text-top" />
                        <span className='ms-2'>PIC STOCK</span>
                    </div>
                </Link>
                <Link to='/account' style={{ textDecoration: 'none' }}>
                    <div className='d-flex flex-row align-items-center text-light'>
                        <PersonIcon />
                        <span className='mx-3'>
                            {props.account}
                        </span>
                    </div>
                </Link>
            </div>
        </nav>

    )
}

export default Navbar