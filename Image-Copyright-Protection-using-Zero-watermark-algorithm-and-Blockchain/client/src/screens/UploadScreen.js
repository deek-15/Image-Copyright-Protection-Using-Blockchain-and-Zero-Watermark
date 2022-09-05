import React, { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useHistory } from 'react-router-dom';
import axios from "axios";

const UploadScreen = (props) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState('');
    const [logo, setLogo] = useState('');
    const [ipfsHashR, setIpfsHashR] = useState('');
    const [ipfsHashG, setIpfsHashG] = useState('');
    const [ipfsHashB, setIpfsHashB] = useState('');
    const [buffer, setBuffer] = useState(null);
    const [uploading, setUploading] = useState(false);
    const history = useHistory();

    const titleChangeHandler = (e) => {
        setTitle(e.target.value);
    }
    const descChangeHandler = (e) => {
        setDescription(e.target.value);
    }
    const fileChangeHandler = (e) => {
        setFile(e.target.files[0]);
    }
    const cancelFileHandler = () => {
        setFile(null);
    }
    const logoChangeHandler = (e) => {
        setLogo(e.target.files[0]);
    }
    const cancelLogoHandler = () => {
        setLogo(null);
    }
    const cancelHandler = () => {
        setTitle('');
        setDescription('');
        setFile(null);
    }

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
    const uploadHandler = async (e) => {
        try {
            e.preventDefault();
            setUploading(true);
            const base64Image = await getBase64(file);
            const base64Logo = await getBase64(logo);

            const config = {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
            const data = new FormData();
            data.append('image', base64Image.toString());
            data.append('logo', base64Logo.toString());

            const response = await axios.post('http://localhost:5000/generate', data, config);
            console.log(response);

            const ZWRUrl = "data:image/jpg;base64," + response.data.ZWR;
            const ZWGUrl = "data:image/jpg;base64," + response.data.ZWG;
            const ZWBUrl = "data:image/jpg;base64," + response.data.ZWB;

            let ZWRHash, ZWGHash, ZWBHash;

            let ZWRImage = await fetch(ZWRUrl);
            ZWRImage = await ZWRImage.blob();
            const reader = new window.FileReader()
            reader.readAsArrayBuffer(ZWRImage)
            reader.onloadend = () => {
                props.ipfs.add(Buffer(reader.result), async (err, result1) => {
                    console.log("https://ipfs.io/ipfs/" + result1[0].hash);
                    if (err) {
                        console.log(err);
                        return;
                    }
                    setIpfsHashR(result1[0].hash);
                    ZWRHash = result1[0].hash;

                    let ZWGImage = await fetch(ZWGUrl);
                    ZWGImage = await ZWGImage.blob();
                    const reader = new window.FileReader()
                    reader.readAsArrayBuffer(ZWGImage)
                    reader.onloadend = () => {
                        props.ipfs.add(Buffer(reader.result), async (err, result2) => {
                            console.log("https://ipfs.io/ipfs/" + result2[0].hash);
                            if (err) {
                                console.log(err);
                                return;
                            }
                            setIpfsHashG(result2[0].hash);
                            ZWGHash = result2[0].hash;

                            let ZWBImage = await fetch(ZWBUrl);
                            ZWBImage = await ZWBImage.blob();
                            const reader = new window.FileReader()
                            reader.readAsArrayBuffer(ZWBImage)
                            reader.onloadend = () => {
                                props.ipfs.add(Buffer(reader.result), async (err, result3) => {
                                    console.log("https://ipfs.io/ipfs/" + result3[0].hash);
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    setIpfsHashB(result3[0].hash);
                                    ZWBHash = result3[0].hash;

                                    const status = await props.contract.methods.uploadImage(ZWRHash,
                                        ZWGHash,
                                        ZWBHash,
                                        title,
                                        description,
                                        response.data.key1.toString(),
                                        response.data.key2.toString()).send({ from: props.account });
                                    console.log(status);

                                    setBuffer(null);
                                    setTitle('');
                                    setDescription('');
                                    setFile('');
                                    setLogo('')

                                    history.push('/account');
                                    setUploading(false);
                                });
                            }
                        });
                    }
                });
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div className="container">
                <h2 className="mt-3">Upload Image</h2>
                <hr className="mb-3" />
                <form onSubmit={uploadHandler} >
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Title</label>
                        <input type="text" className="form-control" value={title} onChange={titleChangeHandler} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Description</label>
                        <textarea className="form-control" onChange={descChangeHandler} value={description} ></textarea>
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Select image</label>
                        <input type="file" className="form-control" name="image" onChange={fileChangeHandler} accept='.png,.jpg,.jpeg' />
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
                    <div className="mb-3" >
                        <label htmlFor="" className="form-label">Select logo</label>
                        <input type="file" className="form-control" name="logo" onChange={logoChangeHandler} accept='.png,.jpg,.jpeg' />
                    </div>
                    {logo &&
                        <div className="mb-3 mt-1 mx-auto shadow p-3 bg-body rounded" style={{ width: '15vw' }}>
                            {/* <label htmlFor="" class="form-label">Preview</label> */}
                            <div className="d-flex justify-content-end">
                                <CancelIcon onClick={cancelLogoHandler} style={{ cursor: 'pointer' }} className='' />
                            </div>
                            <img src={URL.createObjectURL(logo)} alt="" width='100%' />
                        </div>
                    }

                    {uploading ?
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        :
                        <div className="d-flex">
                            <button type='submit' className="btn btn-dark me-2" >Upload</button>
                            <button type='reset' className="btn btn-light" onClick={cancelHandler}>Cancel</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default UploadScreen