import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import "/home/mfrikken/WebstormProjects/frontend/src/css/Upload.css";

const FileUpload = ({onFileUpload}) => {
    const [uploadFile, setUploadFile] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFile) => {
            if (!checkFileSize(acceptedFile[0])) {
                return;
            }
            const file = acceptedFile[0];
            setUploadFile(file);
            setPreviewImage(URL.createObjectURL(file));
            onFileUpload(file);
        },
    });

    function checkFileSize(file) {
        const maxSizeInBytes = 5 * 1024 * 1024;
        console.log(file.size);
        if (file.size > maxSizeInBytes) {
            alert("File to big.\nFile must not be bigger than 5MB.");
            return false;
        }
        return true;
    }

    return (
        <div {...getRootProps()} >
            <input {...getInputProps()} />
            {previewImage ? (
                <div className="uploadBoxText">
                    <img src={previewImage} alt="Upload File"/>
                </div>
            ) : (
                <div className="uploadBoxText">
                    <p>Drag and drop file here!</p>
                    <ul>
                        {uploadFile.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function Upload() {
    const [uploadFile, setUploadFile] = useState(null);
    const [result, setResult] = useState(null);
    const [accuracy, setAccuracy] = useState(null);

    const handleServerResponse = (responseData) => {
        const id = responseData.id;
        const value1 = responseData.values[0];
        const value2 = responseData.values[1];
        setAccuracy([value1, value2]);

        if (!isNaN(parseFloat(value1)) && !isNaN(parseFloat(value2))) {
            if (parseFloat(value1) < parseFloat(value2)) {
                setResult(true);
            } else {
                setResult(false);
            }
        } else {
            console.log("NaN");
        }

        console.log(id);
    }

    const handleFileUpload = (file) => {
        setUploadFile(file);
    };

    const uploadToServer = () => {
        if (uploadFile) {
            const formData = new FormData();
            formData.append('image', uploadFile);

            fetch('http://localhost:3001/allaihoop/interpretation', {
                method: "POST",
                body: formData,
                credentials: 'include'
            })
                .then((response) => {
                    if (response.ok) {
                        response.json()
                            .then((data) => {
                                console.log(data);
                                handleServerResponse(data);
                                setUploadFile([]);
                            });
                    } else {
                        throw new Error("Network response was not ok.");
                    }
                })
                .catch((error) => {
                    console.log("Error uploading the image: ", error);
                });
        }
    };

    return (
        <div className="upload">
            <div className="uploadImage">
                <FileUpload onFileUpload={handleFileUpload}/>
            </div>
            {accuracy ? (
                <div className="accuracy">
                    <p>Is: {accuracy[1]} (approx.)</p>
                    <p>Is not: {accuracy[0]} (approx.)</p>
                </div>
            ) : (
                <div className="accuracy">
                    <p></p>
                    <p></p>
                </div>
            )}
            <div className="result">
                {result !== null ? (
                    result ? (
                        <span>
                        It <span className="highlight-word">is</span> Lebron James!
                    </span>
                    ) : (
                        <span>
                        That's <span className="highlight-word">not</span> Lebron James.
                    </span>
                    )
                ) : (
                    <span>Let' see...</span>
                )}


            </div>
            <div className="buttons">
                <button className="custom-button" onClick={uploadToServer}>Upload File</button>
            </div>

        </div>
    )
}

export default Upload;



