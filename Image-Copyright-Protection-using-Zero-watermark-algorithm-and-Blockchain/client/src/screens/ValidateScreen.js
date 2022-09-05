import React, { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ValidateScreen = (props) => {
    const [ipfsHashR, setIpfsHashR] = useState('');
    const [ipfsHashG, setIpfsHashG] = useState('');
    const [ipfsHashB, setIpfsHashB] = useState('');
    const [key1, setKey1] = useState('');
    const [key2, setKey2] = useState('');
    const [file, setFile] = useState('');
    const [logo, setLogo] = useState('');
    const [buffer, setBuffer] = useState(null);
    const [validating, setValidating] = useState(false);
    const history = useHistory();

    const hashRInputHandler = (e) => {
        setIpfsHashR(e.target.value);
    };
    const hashGInputHandler = (e) => {
        setIpfsHashG(e.target.value);
    };
    const hashBInputHandler = (e) => {
        setIpfsHashB(e.target.value);
    };
    const key1InputHandler = (e) => {
        setKey1(e.target.value);
    };
    const key2InputHandler = (e) => {
        setKey2(e.target.value);
    };

    const fileChangeHandler = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(e.target.files[0]);
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(uploadedFile)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result))
        }
    }
    const cancelFileHandler = () => {
        setFile(null);
    }

    const cancelHandler = () => {
        setFile(null);
        setIpfsHashR('');
        setIpfsHashG('');
        setIpfsHashB('');
    };

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    const validateHandler = async (e) => {
        try {
            e.preventDefault();
            setValidating(true);

            const ZWRUrl = `https://ipfs.io/ipfs/${ipfsHashR}`;
            const ZWGUrl = `https://ipfs.io/ipfs/${ipfsHashG}`;
            const ZWBUrl = `https://ipfs.io/ipfs/${ipfsHashB}`;

            let ZWRImage = await fetch(ZWRUrl);
            ZWRImage = await ZWRImage.blob();
            let ZWGImage = await fetch(ZWGUrl);
            ZWGImage = await ZWGImage.blob();
            let ZWBImage = await fetch(ZWBUrl);
            ZWBImage = await ZWBImage.blob();

            const base64ZWR = await getBase64(ZWRImage);
            const base64ZWG = await getBase64(ZWGImage);
            const base64ZWB = await getBase64(ZWBImage);
            const base64Image = await getBase64(file);
            const config = {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
            const data = new FormData();
            data.append('image', base64Image.toString());
            data.append('ownerR', base64ZWR.toString());
            data.append('ownerG', base64ZWG.toString());
            data.append('ownerB', base64ZWB.toString());
            data.append('key1', key1);
            data.append('key2', key2);

            const response = await axios.post('http://localhost:5000/extract', data, config);
            console.log(response);
            setLogo("data:image/jpg;base64," + response.data.logoImage);
            setValidating(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="container">
                <h2 className="mt-3">Validate Image</h2>
                <hr className="mb-3" />
                <form onSubmit={validateHandler}>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Enter IPFS Hash for Ownership image channel - R</label>
                        <input type="text" className="form-control" onChange={hashRInputHandler} value={ipfsHashR} />
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Enter IPFS Hash for Ownership image channel - G</label>
                        <input type="text" className="form-control" onChange={hashGInputHandler} value={ipfsHashG} />
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Enter IPFS Hash for Ownership image channel - B</label>
                        <input type="text" className="form-control" onChange={hashBInputHandler} value={ipfsHashB} />
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Enter key 1</label>
                        <input type="text" className="form-control" onChange={key1InputHandler} value={key1} />
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Enter key 2</label>
                        <input type="text" className="form-control" onChange={key2InputHandler} value={key2} />
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Select image</label>
                        <input type="file" className="form-control" onChange={fileChangeHandler} accept='.png,.jpg,.jpeg' />
                    </div>
                    {file &&
                        <div className="mb-3 mt-1 mx-auto shadow p-3 bg-body rounded" style={{ width: '20vw' }}>
                            {/* <label htmlFor="" class="form-label">Preview</label> */}
                            <div className="d-flex justify-content-end">
                                <CancelIcon onClick={cancelFileHandler} style={{ cursor: 'pointer' }} className='' />
                            </div>
                            <img src={URL.createObjectURL(file)} alt="" width='100%' />
                        </div>
                    }
                    {validating ?
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        :
                        <div className="d-flex">
                            <button type='submit' className="btn btn-dark me-2">Validate</button>
                            <button type='reset' className="btn btn-light" onClick={cancelHandler}>Cancel</button>
                        </div>
                    }

                </form>
                {logo &&
                    <div className="mb-3 mt-1 mx-auto shadow p-3 bg-body rounded">
                        <h3>Extracted logo</h3>
                        <img src={logo} alt="" width='128px' height='128px' />
                    </div>}
            </div>
        </div>
    )
}

export default ValidateScreen