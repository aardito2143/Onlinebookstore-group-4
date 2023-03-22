import { useState } from "react";
import { axiosPrivate } from "../../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const BOOKS_URL = "/api/products";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("mystery");
  const [category, setCategory] = useState("best seller");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        BOOKS_URL,
        JSON.stringify({ title, author, genre, desc, price, category })
      );

      console.log(JSON.stringify(response?.data));
      toast.success("Successfully Created a New Product!");
    } catch (err) {
      if (!err?.response) {
        toast.error("Server Connection Timed Out");
        setErrMsg("Server Connection Timed Out");
      } else if (err?.response?.status === 403) {
        setErrMsg("You lack sufficient privileges to make this request");
        toast.error("You lack sufficient priveleges to make this request");
      } else {
        setErrMsg("Failed to Create New Product");
        toast.error("Failed to Create New Product");
      }
    }
  };

  return (
    <div
      className={"Container"}
      style={{
        background: "#084887",
        width: "100vh",
        boxShadow: "2px 3px 10px #F7F5FB",
        alignItems: "Center",
        justifyContent: "Center",
        marginLeft: "22em",
        marginTop: ".3em",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1
          style={{
            fontFamily: "Fredoka One",
            fontSize: "3em",
            padding: ".5em",
            marginLeft: "3em",
            textShadow: "4px 4px 4px #F58A07",
          }}
        >
          Add A New Book
        </h1>
        <p
          style={{
            fontFamily: "Fredoka One",
            fontSize: "1.5em",
            padding: ".5em",
            marginLeft: "1em",
          }}
        >
          Fill out the fields below to add a new Book to the site
        </p>
        <span>{errMsg}</span>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="title">Book Title</label>
          <input
            className={"form-input"}
            id="title"
            name="title"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              padding: ".2em",
            }}
          />
        </div>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="author">Book Author</label>
          <input
            className="form-input"
            id="author"
            name="author"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              padding: ".2em",
            }}
          />
        </div>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="genre">Book Genre</label>
          <select
            className="form-select-field"
            id="genre"
            name="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              padding: ".2em",
            }}
          >
            <option value="mystery">Mystery</option>
          </select>
        </div>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="category">Book Category</label>
          <select
            className="form-select-field"
            id="category"
            name="category"
            defaultValue={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              padding: ".2em",
            }}
          >
            <option value="best seller">Best Seller</option>
            <option value="classics">Classics</option>
          </select>
        </div>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="description">Book Description</label>
          <textarea
            className="from-text-area"
            id="description"
            name="description"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setDesc(e.target.value)}
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              marginTop: "1em",
              padding: ".2em",
            }}
          ></textarea>
        </div>
        <div
          className={"form-input-field"}
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
          }}
        >
          <label htmlFor="price">Book Price</label>
          <input
            className="form-input-field"
            id="price"
            name="price"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              borderBlockColor: "green",
              marginLeft: "1em",
              marginTop: "1em",
              padding: ".2em",
            }}
          />
        </div>
        <button
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "13em",
            background: "green",
            padding: ".3em",
            marginBottom: "1em",
            borderRadius: "1em",
            color: "white",
            borderColor: "green",
          }}
        >
          Create
        </button>
        <button
          style={{
            fontFamily: "Tahoma",
            fontSize: "1em",
            marginLeft: "5em",
            marginTop: "1em",
            borderRadius: "1em",
            color: "white",
            borderColor: "white",
            background: "white",
            padding: ".3em",
            textDecoration: "none",
          }}
        >
          <Link to="/dashboard">Back to Dashboard</Link>
        </button>
      </form>
    </div>
  );
}
