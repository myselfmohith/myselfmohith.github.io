function getPostcard(title, description, timeMs, filename) {
    return `<a href="/posts/${filename}.html" class="item-card">
                <div class="item-card-name">${title}</div>
                <div class="item-card-desc">${description}</div>
                <div class="tags">
                    <div class="tag-pill">${new Date(timeMs).toLocaleString()}</div>
                </div>        
            </a>`;
}

function getUtilCard(title, timeMs) {
    return `<a href="/utils/${title}" target="_blank" class="item-card">
                <div class="item-card-name">${title}</div>
                <div class="tags">
                    <div class="tag-pill">${new Date(timeMs).toLocaleString()}</div>
                </div>        
            </a>
            `;
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
                const postsSection = document.getElementById("posts");
                for (const postData of response["latest_posts"]) {
                    postsSection.innerHTML += getPostcard(postData["title"], postData["description"], postData["birth"], postData["filename"]);
                }
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