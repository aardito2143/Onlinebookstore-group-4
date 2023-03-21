import { Link } from "react-router-dom";
import "./Error404.css";

export default function ErrorPage() {
    return (
      <section class='error-page-container'>
         <div id="error-page">
            <div className="content">
               <h2 className="header" data-text="404">
                  404
               </h2>
               <h4>
                  This Is Not The Page You Are Looking For
               </h4>
               <p>
                  Sorry, we had to jedi mind trick you since the page you're looking for doesn't exist. 
               </p>
               <div className="btns">
                  <Link to="/">Roger Roger (Return Home)</Link>
               </div>
            </div>
         </div>
      </section>
    );
}