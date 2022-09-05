import React from 'react'
import ImageCard from '../components/ImageCard'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
    return (
        <>
            <div className="container my-3">
                <div className="text-center">
                    <h2>
                        IPFS powered image sharing platform
                    </h2>
                    <div className="d-flex container justify-content-around mt-5">
                        <Link to='/upload' style={{ textDecoration: 'none' }}>
                            <div className="card shadow bg-body rounded p-2" >
                                <img src="/generate.jpg" alt="" className="card-img-top" height="350px" />
                                <div className="card-body">
                                    <button className="btn btn-dark">Upload an image</button>
                                </div>
                            </div>
                        </Link>
                        <Link to='/validate' style={{ textDecoration: 'none' }}>
                            <div className="card shadow bg-body rounded p-2" >
                                <img src="/validate.jpg" alt="" className="card-img-top" height="350px" />
                                <div className="card-body">
                                    <button className="btn btn-dark">Validate an image</button>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>
        </>

    )
}

export default HomeScreen