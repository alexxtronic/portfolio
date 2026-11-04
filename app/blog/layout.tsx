import Link from "next/link";
import "./blog.css";

// The blog shares the homepage's paper-and-ink look rather than the older dark site chrome.
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="journal">
            <header className="j-bar">
                <Link className="j-bar__name" href="/">A. D&rsquo;Amore</Link>
                <span className="j-bar__label mono">The Snarky AI Marketer</span>
                <nav className="j-bar__nav" aria-label="Primary">
                    <Link href="/#work">Work</Link>
                    <Link href="/blog" aria-current="page">Blog</Link>
                    <Link href="/#hire">Hire</Link>
                </nav>
            </header>
            {children}
            <footer className="j-foot">
                <div className="j-foot__cta">
                    <p className="mono"><span className="sq" aria-hidden="true"></span>Freelance, remote, US and EU teams</p>
                    <Link className="j-foot__big" href="/#hire">Start a project <span aria-hidden="true">&rarr;</span></Link>
                </div>
                <div className="j-foot__row mono">
                    <span>&copy; {new Date().getFullYear()} Alexander D&rsquo;Amore</span>
                    <span className="j-foot__links">
                        <a href="mailto:alexdamore2@gmail.com">Email</a>
                        <a href="https://www.linkedin.com/in/alexdamore/" target="_blank" rel="noopener">LinkedIn</a>
                        <a href="/blog/rss.xml">RSS</a>
                    </span>
                </div>
            </footer>
        </div>
    );
}
