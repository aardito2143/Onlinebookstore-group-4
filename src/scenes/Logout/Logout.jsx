import { Link } from "react-router-dom";

export default function Logout() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontFamily: "Roboto",
          fontSize: "4rem",
          textTransform: "uppercase",
          fontWeight: "700",
        }}
      >
        Successfully Logged Out
      </h1>
      <Link
        to="/"
        style={{
          fontFamily: "Roboto",
          marginTop: "40px",
          backgroundColor: "#f9ab55",
          padding: ".5em 2em",
          border: "4px solid white",
          borderRadius: "2rem",
          color: "white",
          fontWeight: "700",
          textTransform: "uppercase",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
