import React from "react";
import HorizontalWrap from "../components/HorizontalWrap";

const AboutUs = () => (
    
  <HorizontalWrap>

<h1 className="text-blue-500 text-4xl">About Us</h1>
    <p>
      Welcome to our project!
    </p>
    <section>
      <h2>Our Mission</h2>
      <p>
        Our mission is to simplify data management and empower users with robust, user-friendly tools.
      </p>
    </section>
    <section>
      <h2>Meet the Team</h2>
      <ul>
        <li>Isa Sero – Project Lead</li>
        <li>Jane Doe – Backend Developer</li>
        <li>John Smith – Frontend Developer</li>
      </ul>
    </section>
    <section>
      <h2>Contact</h2>
      <p>
        Have questions? Reach out at <a href="mailto:info@dbproject.com">info@dbproject.com</a>.
      </p>
    </section>

  </HorizontalWrap>

);

export default AboutUs;