/**
 * Switch between posts and utils on click
 */
function activeCurrent(element) {
    if (element.textContent === "Posts") {
        element.nextElementSibling.style.backgroundColor = "unset";
        document.getElementById("latest-utils").style.display = "none";
        document.getElementById("latest-posts").style.display = "inherit";
    } else {
        element.previousElementSibling.style.backgroundColor = "unset";
        document.getElementById("latest-utils").style.display = "inherit";
        document.getElementById("latest-posts").style.display = "none";
    }
    element.style.backgroundColor = "#555";
}

function getPostcard(title, description, timeMs, filename) {
    return `<a href="/posts/${filename}.html" class="item-card">
                <h3>${title}</h3>
                <span>${new Date(timeMs).toLocaleString()}</span>
                <p>${description}</p>
            </a>`;
}

function getUtilCard(title, timeMs) {
    return `<a href="/utils/${title}" target="_blank" class="item-card">
                <h3>${title}</h3>
                <span>${new Date(timeMs).toLocaleString()}</span>
            </a>`;
}

function fetchJson(url) {
    return fetch(url)
        .then(response => {
            if (response.status != 200) {
                throw { "message": "Ops! Something is wrong." };
            }
            return response.json();
        })
        .catch(err => {
            console.error(err);
        });
}

function homePage() {
    fetchJson("/scripts/latest_data.json")
        .then(response => {
            if (response["latest_posts"] && response["latest_utils"]) {
                // set data
                const latestPostsContainer = document.getElementById("latest-posts"),
                    latestUtilsContainer = document.getElementById("latest-utils");
                for (const postData of response["latest_posts"]) {
                    latestPostsContainer.innerHTML += getPostcard(postData["title"], postData["description"], postData["birth"], postData["filename"]);
                }
                latestPostsContainer.innerHTML += `
                <a class="full-items" align="center" href="/posts.html">All Posts</a>
                `

                for (const utilData of response["latest_utils"]) {
                    latestUtilsContainer.innerHTML += getUtilCard(utilData[0], utilData[1]);
                }
                latestUtilsContainer.innerHTML += `
                <a class="full-items" href="/utils.html">All Utils</a>
                `
            };
        })
}

// todo: optimize if had more data
function postsPage() {
    const itemCardsContainer = document.querySelector(".item-cards-container");
    fetchJson("/scripts/data-posts.json")
        .then(posts => {
            for (const [_, value] of Object.entries(posts)) {
                itemCardsContainer.innerHTML += getPostcard(value["title"], value["description"], value["birth"], value["filename"]);
            }
        })
}

function utilsPage() {
    const itemCardsContainer = document.querySelector(".item-cards-container");
    fetchJson("/scripts/data-utils.json")
        .then(utils => {
            for (const [key, value] of Object.entries(utils)) {
                itemCardsContainer.innerHTML += getUtilCard(key, value);
            }
        })
}