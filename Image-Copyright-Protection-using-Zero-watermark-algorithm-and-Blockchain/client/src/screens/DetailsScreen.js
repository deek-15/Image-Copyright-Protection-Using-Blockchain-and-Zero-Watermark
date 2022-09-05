import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
const DetailsScreen = (props) => {
    const { id } = useParams();
    const [image, setImage] = useState({});
    const history = useHistory();

    useEffect(() => {
        const loadImage = async () => {
            const data = await props.contract.methods.getImage(id).call({ from: props.account });
            setImage({
                ipfsHashR: data.ipfsHashR,
                ipfsHashG: data.ipfsHashG,
                ipfsHashB: data.ipfsHashB,
                desc: data.desc,
                title: data.title,
                uploadedOn: data.uploadedOn,
                key1: data.key1,
                key2: data.key2
            });
        };
        loadImage();
    }, [id]);

    return (
        <>
            <div className="container my-2">
                <button className='btn btn-dark' onClick={() => { history.push('/') }}>Back to Home</button>
                <div className="row mt-2">
                    <div className="col-md-4">
                        <img src="/image.jpg" alt="" width='100%' className='mb-2 shadow p-3 bg-body rounded' />

                    </div>
                    <div className="col-md-8">
                        <h2>Image Details</h2>
                        <hr />
                        <table className="table table-hover">
                            <tbody>
                                <tr>
                                    <td>Title</td>
                                    <td>{image.title}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{image.desc}</td>
                                </tr>
                                <tr>
                                    <td>Owner</td>
                                    <td>{props.account}</td>
                                </tr>
                                <tr>
                                    <td>Uploaded on</td>
                                    <td>{image.uploadedOn}</td>
                                </tr>
                                <tr>
                                    <td>IPFS Hash for channel - R</td>
                                    <td className='d-flex flex-row align-items-center justify-content-between'>{image.ipfsHashR} <a href={`https://ipfs.io/ipfs/${image.ipfsHashR}`} className="btn btn-dark">Open</a></td>
                                </tr>
                                <tr>
                                    <td>IPFS Hash for channel - G</td>
                                    <td className='d-flex flex-row align-items-center justify-content-between'>{image.ipfsHashG} <a href={`https://ipfs.io/ipfs/${image.ipfsHashG}`} className="btn btn-dark">Open</a></td>
                                </tr>
                                <tr>
                                    <td>IPFS Hash for channel - B</td>
                                    <td className='d-flex flex-row align-items-center justify-content-between'>{image.ipfsHashB} <a href={`https://ipfs.io/ipfs/${image.ipfsHashB}`} className="btn btn-dark">Open</a></td>
                                </tr>
                                <tr>
                                    <td>Key 1</td>
                                    <td>{image.key1}</td>
                                </tr>
                                <tr>
                                    <td>Key 2</td>
                                    <td>{image.key2}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsScreen