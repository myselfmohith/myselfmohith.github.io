import * as fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import showdown from "showdown";
import gitlog from "gitlog";

const CONSTANTS = {
    HTML_TEMPLATE: fs.readFileSync("build/template.html", { encoding: "utf-8" }),
    LATEST_POSTS_JSON: "dst/scripts/latest_data.json",
    POSTS_JSON: "dst/scripts/data-posts.json",
    UTILS_JSON: "dst/scripts/data-utils.json",
    POSTS_DIR: "dst/posts"
}

const posts = {}, utils = {};

const FUNCTIONS = {
    slugify: function (text) {
        return text.toLocaleLowerCase().replace(/[^a-z0-9]/ig, "-").replace(/-+/g, "-").replace(/(^-)|(-$)/g, "")
    },
    trimText: function (text = "", size = 60) {
        return text.length < size ? text : (text.substring(0, size - 3) + "...");
    },
    /**
     * Convert's markdown to html and creates new html file in posts folder. We use the first mentioned tag to construct metadata.
     * 1. Title = h1 tag
     * 2. Description = h5 tag
     * 3. Keywords = h6 tag
     * 
     * We use are the header tags to build index, which will be replaced at #post-index > ul.
     * And the markdown content will be replace at #post
     * @param {*} markDownText 
     * @returns 
     */
    parseToHtml: function (markDownText) {
        const converter = new showdown.Converter({
            "tables": true,
            "simplifiedAutoLink": true,
            "strikethrough": true,
            "tasklists": true
        });
        converter.setOption("ghCompatibleHeaderId", true);
        converter.setOption("customizedHeaderId", true);


        const htmlString = converter.makeHtml(markDownText);
        const $src = cheerio.load(htmlString);

        const postHead = $src('h1');
        const postDescription = $src('h5');
        const postKeywords = $src('h6');

        const $new = cheerio.load(CONSTANTS.HTML_TEMPLATE);
        const postTitle = postHead.text();
        $new("title").text(FUNCTIONS.trimText(postTitle));
        $new("meta[name=description]").attr("content", postDescription.text());
        $new("meta[name=keywords]").attr("content", postKeywords.text());

        postDescription.remove();
        postKeywords.remove();

        const postIndexUl = $new("section#page>div#post-index>ul");
        let isFirst = true;
        for (const headingElement of $src("h1,h2,h3,h4,h5,h6,h4")) {
            let currentId = $src(headingElement).attr("id");
            if (!currentId) {
                currentId = FUNCTIONS.slugify($src(headingElement).text())
            }
            $src(headingElement).attr("id", currentId);
            if (isFirst) {
                $new(postIndexUl).append("<li><a href='#" + currentId + "'>Top</a></li>");
                isFirst = false;
            } else {
                $new(postIndexUl).append("<li><a href='#" + currentId + "'>" + FUNCTIONS.trimText($src(headingElement).text(), 50) + "</a></li>");
            }
        }

        $new("section#page>article#post").html($src.html());

        return { "filename": FUNCTIONS.slugify(FUNCTIONS.trimText(postTitle), 100), "html": $new.html(), "title": postTitle, "description": postDescription.text() };
    },
    fileStatsTime: async function (filename) {
        try {
            const resp = await gitlog({
                repo: ".",
                file: filename,
                fields: ["authorDate"],
                number: 1
            });

            return new Date(resp[0]["authorDate"]).getTime();
        } catch (error) {
            console.error(error);
            return 0;
        }
    }
}

for (const file of fs.readdirSync("posts")) {
    if (file.endsWith(".md")) {
        try {
            const birthTime = await FUNCTIONS.fileStatsTime(path.join("posts", file));
            const md = fs.readFileSync(path.join("posts", file), { encoding: "utf-8" });
            const object = FUNCTIONS.parseToHtml(md);
            fs.writeFileSync(path.join(CONSTANTS.POSTS_DIR, object["filename"] + ".html"), object["html"], { encoding: "utf-8" });
            posts[object["filename"]] = { birth: birthTime, ...object, html: undefined };
            console.log("SUCCESS: " + file + " -> " + object["filename"] + ".html");
        } catch (error) {
            console.log("ERROR:" + file + " -> " + error.message);
            console.log(error);
        }
    }
}


for (const file of fs.readdirSync("utils")) {
    if (file.endsWith(".html")) {
        try {
            const birthTime = await FUNCTIONS.fileStatsTime(path.join("utils", file));
            utils[file] = birthTime;
        } catch (error) {
            console.log("ERROR:" + file + " -> " + error.message);
            console.log(error);
        }
    }
}

const latest_posts = Object.entries(posts).sort((a, b) => b[1]["birth"] - a[1]["birth"]).map(a => a[1]).slice(0, 5);
const latest_utils = Object.entries(utils).sort((a, b) => b[1] - a[1]).slice(0, 5);

fs.writeFileSync(CONSTANTS.LATEST_POSTS_JSON, JSON.stringify({ latest_posts, latest_utils }), { encoding: "utf-8" });
fs.writeFileSync(CONSTANTS.POSTS_JSON, JSON.stringify(posts), { encoding: "utf-8" });
fs.writeFileSync(CONSTANTS.UTILS_JSON, JSON.stringify(utils), { encoding: "utf-8" });