import {React, useState} from 'react';
import { FaPlus } from "react-icons/fa";
import CreatePostForm from "./CreatePostForm";


const CreatePostButton = () => {
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);

    const openPostForm = () => {
        setIsPostFormOpen(true);
    }
    const closePostForm = () => {
        setIsPostFormOpen(false);
    }

    return (
        <div className="create-post-btn-container" onClick={openPostForm}>
            <FaPlus className="create-post-btn-icon" />
            {isPostFormOpen && <CreatePostForm isOpen={isPostFormOpen} onClose={closePostForm}/>}

        </div>
    )
}


export default CreatePostButton;