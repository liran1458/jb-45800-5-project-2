import "./About.css";
function About() {
    return (
        <section className="about">
            <h2>About</h2>
            <div className="about-card">
                <h3>Cryptonite Project</h3>
                <p>This React + TypeScript project displays crypto coins, live reports and AI recommendations using Redux for global state.</p>
                <p>Developer: Liran Aharoni Hadad</p>
                <div className="profile-placeholder">photo</div>
            </div>
        </section>
    );
}
export default About;
