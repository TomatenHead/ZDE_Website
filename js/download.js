// -------- RELEASES --------
fetch("https://api.github.com/repos/TomatenHead/Zero_Day_Exploit/releases")
    .then(res => res.json())
    .then(releases => {
        const container = document.getElementById("releaseContainer");

        if (!Array.isArray(releases) || releases.length === 0) {
            container.innerHTML = "<p>No releases found.</p>";
            return;
        }

        releases.forEach(r => {
            const el = document.createElement("div");
            el.classList.add("log-entry");

            el.innerHTML = `
        <h3>${r.name || "Unnamed Release"} — ${new Date(r.published_at).toLocaleDateString()}</h3>
        <p>${r.body ? r.body.replace(/\n/g, "<br>") : "No changelog provided."}</p>
        <a href="${r.html_url}" target="_blank">View Release</a>
      `;

            container.appendChild(el);
        });
    })
    .catch(err => console.error("Release Error:", err));


// -------- COMMITS --------
fetch("https://api.github.com/repos/TomatenHead/Zero_Day_Exploit/commits?per_page=15")
    .then(res => res.json())
    .then(commits => {
        const container = document.getElementById("commitContainer");

        if (!Array.isArray(commits)) {
            container.innerHTML = "<p>Could not load commits.</p>";
            return;
        }

        commits.forEach(commit => {
            const el = document.createElement("div");
            el.classList.add("log-entry");

            el.innerHTML = `
        <h3>${commit.commit.author.name} — ${new Date(commit.commit.author.date).toLocaleDateString()}</h3>
        <p>${commit.commit.message}</p>
        <a href="${commit.html_url}" target="_blank">View Commit</a>
      `;

            container.appendChild(el);
        });
    })
    .catch(err => console.error("Commit Error:", err));
