import React, { useEffect } from 'react';
import { useState } from 'react';

export default function Input({ sendDataToParent }) {
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        sendDataToParent(selectedFile);
      }, [selectedFile]);

    //Legge in file in input e setta @selectedFile con il suo contenuto
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            setSelectedFile(reader.result);
        }
    }
    
    return (
        <form>
            <input
                type="file"
                onChange={handleFileChange}
            />
        </form>
     );
   }