import React from 'react'
import PublicIcon from '@mui/icons-material/Public';
import { useHistory, Link } from 'react-router-dom';

const ImageCard = (props) => {
    const history = useHistory();

    return (
        <>
            <div className="card shadow bg-body rounded p-2">
                {/* <img src="/sample-img.jpg" alt="" className="card-img-top" /> */}
                <div className="card-body">
                    <h5 className="card-title">{props.image.title}</h5>
                    <div className='my-2'>
                        <PublicIcon />
                        <p className="card-text">
                            {props.image.desc}
                        </p>
                    </div>

                    <button className="btn btn-dark" onClick={() => {
                        history.push(`/image/${props.image.index}`);
                    }}>View Details</button>
                </div>
            </div>
        </>
    )
}

export default ImageCard