import React, {useState} from "react";
import {useDropzone} from "react-dropzone";
import "../css/Upload.css";

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
    const [id, setId] = useState(null);

    const handleServerResponse = (responseData) => {
        const responseid = responseData.id;
        setId(responseid);
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

        console.log(responseid);
    }

    const handleFileUpload = (file) => {
        const generateRandomString = (length) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = "";
            for (let i = 0; i <= length; i++) {
                result += characters.charAt((Math.floor(Math.random() * characters.length)));
            }
            return result;
        };

        const randomFilename = generateRandomString(10);
        const fileExtension = file.name.split(".").pop();
        const generalizedFilename = `${randomFilename}.${fileExtension}`;

        const generalizedFile = new File([file], generalizedFilename, {type: file.type});

        setUploadFile(generalizedFile);
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

    const handleFeedback = (feedbackValue) => {
        if (uploadFile) {
            const jsonBody = {
                filename: `${id}`,
                feedback: feedbackValue,
            };

            fetch("http://localhost:3001/allaihoop/saveImageLongtime", {
                method: "POST",
                body: JSON.stringify(jsonBody),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error("Network response was not ok.");
                    }
                })
                .then((responseText) => {
                    console.log(responseText);
                    setUploadFile([]);
                })
                .catch((error) => {
                    console.log("Error handling the feedback loop. " + error.message);
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
                    <div className="feedback-buttons">
                        <button className="custom-button" onClick={() => handleFeedback(true)}>Yes</button>
                        <button className="custom-button" onClick={() => handleFeedback(false)}>No</button>
                    </div>
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



