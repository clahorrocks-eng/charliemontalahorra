import Chat from './Chat.jsx';
import { Kinetic, Bento, Projects, Sites, Experience, Contact } from './sections.jsx';
import { useSpotlight } from './util.js';

export default function App() {
  useSpotlight();
  return (
    <>
      <nav className="nav" aria-label="Main">
        <a href="#projects">Projects</a>
        <a href="#shipped">Sites</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </nav>
      <main>
        <header className="hero" id="top">
          <Kinetic text="Charlie Lahorra" />
          <p className="lede">Software developer. I build WordPress and Shopify sites, Laravel and React apps, and now ServiceNow. Ask this page instead of scrolling it.</p>
          <Chat />
        </header>
        <Bento />
        <Projects />
        <Sites />
        <Experience />
        <Contact />
      </main>
      <footer>© {new Date().getFullYear()} Charlie Lahorra. All rights reserved.</footer>
    </>
  );
}
