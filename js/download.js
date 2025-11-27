const repoOwner = "TomatenHead";
const repoName = "Zero_Day_Exploit";

// ---------- RELEASES ----------
fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`)
    .then(res => res.json())
    .then(releases => {
        const container = document.getElementById("releaseContainer");
        if (!releases || releases.length === 0) {
            container.innerHTML = "<p>No releases found.</p>";
            return;
        }
        releases.forEach(release => {
            const div = document.createElement("div");
            div.className = "log-entry";

            const title = document.createElement("h3");
            title.textContent = `${release.tag_name} — ${new Date(release.published_at).toLocaleDateString()}`;

            const body = document.createElement("p");
            body.textContent = release.body || "No description available.";

            const link = document.createElement("a");
            link.href = release.html_url;
            link.target = "_blank";
            link.textContent = "View on GitHub";

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);
            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error(err);
        document.getElementById("releaseContainer").innerHTML = "<p>Failed to load releases.</p>";
    });

// ---------- PUSHES / COMMITS ----------
fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`)
    .then(res => res.json())
    .then(commits => {
        const container = document.getElementById("commitContainer");
        if (!commits || commits.length === 0) {
            container.innerHTML = "<p>No commits found.</p>";
            return;
        }
        commits.slice(0, 10).forEach(commit => {
            const div = document.createElement("div");
            div.className = "log-entry";

            const title = document.createElement("h3");
            title.textContent = commit.commit.author.name + " — " + new Date(commit.commit.author.date).toLocaleDateString();

            const body = document.createElement("p");
            body.textContent = commit.commit.message;

            const link = document.createElement("a");
            link.href = commit.html_url;
            link.target = "_blank";
            link.textContent = "View Commit";

            div.appendChild(title);
            div.appendChild(body);
            div.appendChild(link);
            container.appendChild(div);
        });
    })
    .catch(err => {
        console.error(err);
        document.getElementById("commitContainer").innerHTML = "<p>Failed to load commits.</p>";
    });
