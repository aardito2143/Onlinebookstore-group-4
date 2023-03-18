import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
const BOOKS_URL = '/api/products';

export default function () {
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('mystery');
    const [desc, setDesc] = useState('');
    const [price, setPrice] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosPrivate.post(BOOKS_URL,
                JSON.stringify({ title, author, genre, desc, price }));
            
            console.log(JSON.stringify(response?.data));
            toast.success('Successfully Created a New Product!');
        } catch (err) {
            if (!err?.response) {
                toast.error('Server Connection Timed Out');
                setErrMsg('Server Connection Timed Out');
            } else if (err?.response?.status === 403) {
                setErrMsg('You lack sufficient privileges to make this request')
                toast.error('You lack sufficient priveleges to make this request');
            } else {
                setErrMsg('Failed to Create New Product')
                toast.error('Failed to Create New Product');
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Add a new Book</h1>
            <p>Fill out the fields below to add a new Book to the site</p>
            <span>{errMsg}</span>
            <div className="form-input-field">
                <label htmlFor="title">
                    Book Title
                </label>
                <input 
                    className="form-input"
                    id='title'
                    name='title'
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    onChange={(e) => setTitle(e.target.value)} 
                    autoFocus
                    required 
                    />
            </div>
            <div className="form-input-field">
                <label htmlFor="author">
                    Book Author
                </label>
                <input 
                    className="form-input"
                    id='author'
                    name="author"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    />
            </div>
            <div className="form-input-field">
                <label htmlFor="genre">
                    Book Genre
                </label>
                <select
                    className="form-select-field"
                    id='genre'
                    name='genre'
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required>
                        <option value="mystery">Mystery</option>
                </select>
            </div>
            <div className="form-input-field">
                <label htmlFor="description">
                    Book Description
                </label>
                <textarea
                    className="from-text-area"
                    id='description'
                    name='description'
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    >


                </textarea>
            </div>
            <div className="form-input-field">
                <label htmlFor="price">
                    Book Price
                </label>
                <input 
                    className="form-input-field"
                    id="price"
                    name="price"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    />
            </div>
            <button>Create</button>
        </form>
    )
}