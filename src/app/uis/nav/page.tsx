'use client';

function Page() {
    return (
        <nav className="flex justify-center space-x-4">
            <a href="/dashboard" className="nav-item">Home</a>
            <a href="/team" className="nav-item">Team</a>
            <a href="/projects" className="nav-item">Projects</a>
            <a href="/reports" className="nav-item">Reports</a>
        </nav>
    );
}

export default Page;