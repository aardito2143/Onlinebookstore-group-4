import "./About.css";

export default function About() {
  return (
    <section className="about-us">
      <div className="about">
        <div className="about-text">
          <h2>Meet The Team</h2>
          <h5>Mystery Inc. Bookstore Team </h5>
          <p>TaeAjah Cannon-Barnes - Project Manager | UI/UX Designer</p>
          <p>Adam Ardito - Scrum Master | API Integrations</p>
          <p>Taylor Lee - Developer | React Components</p>
          <p>
            Daniel Bevan - Developer | Backend Infrastructure | React Components
          </p>
          <div className="data">
            <a href="./contact-us" className="contact-btn">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
