import React, { useEffect, useState } from 'react'
import ImageCard from '../components/ImageCard'
import PersonIcon from '@mui/icons-material/Person';

const UserScreen = (props) => {
    const [imageCount, setImageCount] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const count = await props.contract.methods.getImageCount().call({ from: props.account });
            setImageCount(count);

            for (let i = 0; i < count; i++) {
                let image = {};
                image = await props.contract.methods.getImage(i).call({ from: props.account });
                // console.log(image)
                setImages(prev => [...prev, {
                    ipfsHashR: image.ipfsHashR,
                    ipfsHashG: image.ipfsHashG,
                    ipfsHashB: image.ipfsHashB,
                    desc: image.desc,
                    title: image.title,
                    uploadedOn: image.uploadedOn,
                    index: i,
                    key1: image.key1,
                    key2: image.key2
                }])
            }
        }
        loadData();
    }, []);

    return (
        <>
            <div className="container">
                <div className="d-flex flex-row align-items-center">
                    <PersonIcon className='fs-2 me-2' />
                    <h2 className='mt-3'>
                        My Account
                    </h2>
                </div>
                <table className="table mt-2">
                    <tbody>
                        <tr>
                            <td>Eth Account</td>
                            <td>{props.account}</td>
                        </tr>
                        <tr>
                            <td>Images count</td>
                            <td>{imageCount}</td>
                        </tr>
                    </tbody>
                </table>
                <h3 className='mt-3'>Your Images</h3>
                <hr />
                <div className="row my-2">
                    {
                        images.length == 0 ? <p>No images</p> :
                            images.map((image) => (
                                <div className="col-lg-3 col-md-4 p-2" key={image.index}>
                                    <ImageCard image={image} />
                                </div>
                            ))
                    }
                </div>
            </div>
        </>
    )
}

export default UserScreen