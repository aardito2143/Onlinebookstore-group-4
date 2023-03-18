import React from 'react';
import Autosuggest from 'react-autosuggest';

const SearchBar = () => {
    const [value, setValue] = React.useState('');
    const [suggestions, setSuggestions] = React.useState([]);

    // Implement autocomplete search functionality here

    const handleSubmit = (e) => {
        e.preventDefault();
        "Book 1"; "Book 2";
        // Implement search functionality here
    };

    return (
        <form onSubmit={handleSubmit}>
            <Autosuggest
            // Implement props for Autosuggest here
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;
