"use strict";

/* ======================================
   BLOGSPHERE V2
   Storage, search, bookmarks and editing
====================================== */

const STORAGE_KEY = "blogsphere_v2_blogs";
const THEME_KEY = "blogsphere_v2_theme";
const BOOKMARK_KEY = "blogsphere_v2_bookmarks";
const LIKE_KEY = "blogsphere_v2_liked_posts";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80";

const defaultBlogs = [
    {
        id: 1001,
        title: "The Little Things That Make Life Better",
        author: "Ava Morgan",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
        content: "Sometimes, the best parts of life are the simplest ones.\n\nA quiet morning, a good book, a conversation with someone you care about, or a few minutes spent outside can make an ordinary day feel special.\n\nWe often look for happiness in big achievements. Yet small moments deserve our attention too. Try slowing down, noticing your surroundings, and making time for the things that help you feel present.\n\nA better day does not always need a big change. Sometimes, it starts with one small thing.",
        date: "2026-10-20",
        likes: 18
    },
    {
        id: 1002,
        title: "How Technology Is Changing Our World",
        author: "Noah Williams",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
        content: "Technology has changed how we communicate, learn, work, and solve problems.\n\nDigital tools allow people to collaborate across distances, find information quickly, and build products that once seemed impossible.\n\nBut technology works best when we use it thoughtfully. Protecting our privacy, checking information carefully, and making time for offline experiences remain important.\n\nThe future is not only about creating new tools. It is also about deciding how those tools can improve everyday life.",
        date: "2026-10-18",
        likes: 24
    },
    {
        id: 1003,
        title: "A Guide to Your Next Adventure",
        author: "Mia Patel",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
        content: "Travel is an opportunity to see familiar things from a new perspective.\n\nBefore a trip, research your destination, make a realistic budget, and leave room for unexpected discoveries. You do not need an expensive itinerary to have a memorable experience.\n\nTry local food, learn about the place you visit, and respect the people and environment around you.\n\nSometimes, the best part of travelling is not how far you go, but what you learn along the way.",
        date: "2026-10-15",
        likes: 12
    },
    {
        id: 1004,
        title: "Learning Skills Beyond the Classroom",
        author: "Ethan Brooks",
        category: "Education",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
        content: "Learning does not stop when a class ends.\n\nPersonal projects, books, discussions, online lessons, and practical experiments can all help us understand a subject more deeply.\n\nStart with one skill you would like to develop. Break it into smaller goals and practise regularly. Mistakes are part of the process, not a reason to stop.\n\nProgress comes from curiosity, patience, and a willingness to keep trying.",
        date: "2026-10-12",
        likes: 15
    },
    {
        id: 1005,
        title: "Turning a Small Idea Into a Business",
        author: "Olivia Chen",
        category: "Business",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
        content: "Many projects begin with a simple idea and a problem someone wants to solve.\n\nBefore investing too much time or money, learn about the people who might use your product. Ask questions, listen to feedback, and test a small version of your idea.\n\nA clear plan can help you decide what to do next, but it is important to stay flexible as you learn.\n\nBuilding something useful is often a process of many small improvements.",
        date: "2026-10-10",
        likes: 9
    },
    {
        id: 1006,
        title: "Finding Focus in a Busy World",
        author: "Liam Carter",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
        content: "With messages, notifications, and endless things to do, concentrating can sometimes feel difficult.\n\nTry choosing one task at a time. Put away distractions when possible, take short breaks, and decide what really needs your attention today.\n\nYou do not have to complete everything at once. A few focused minutes can be a useful start.\n\nMake your routines work for you, and remember that rest is also part of doing good work."
        ,
        date: "2026-10-08",
        likes: 21
    }
];


/* ======================================
   SAFE STORAGE HELPERS
====================================== */

function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value);
    } catch (error) {
        console.error("Could not read local storage:", error);
        return fallback;
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Could not save local storage:", error);
        alert("Your browser could not save this change. Check available storage.");
        return false;
    }
}

function getBlogs() {
    let blogs = readJSON(STORAGE_KEY, null);

    if (!Array.isArray(blogs)) {
        blogs = defaultBlogs.map(blog => ({ ...blog }));

        writeJSON(STORAGE_KEY, blogs);
    }

    return blogs;
}

function saveBlogs(blogs) {
    return writeJSON(STORAGE_KEY, blogs);
}

function getBookmarks() {
    const value = readJSON(BOOKMARK_KEY, []);
    return Array.isArray(value) ? value : [];
}

function getLikedPosts() {
    const value = readJSON(LIKE_KEY, []);
    return Array.isArray(value) ? value : [];
}

function isBookmarked(id) {
    return getBookmarks().includes(Number(id));
}

function isLiked(id) {
    return getLikedPosts().includes(Number(id));
}


/* ======================================
   GENERAL HELPERS
====================================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "Recently";
    }

    const date = new Date(dateValue + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getExcerpt(content, limit = 115) {
    const text = String(content || "").replace(/\s+/g, " ").trim();

    if (text.length <= limit) {
        return text;
    }

    return text.slice(0, limit).trimEnd() + "...";
}

function getWordCount(text) {
    const trimmed = text.trim();

    return trimmed ? trimmed.split(/\s+/).length : 0;
}

function getPostURL(id) {
    return "post.html?id=" + encodeURIComponent(id);
}

function getEditorURL(id) {
    return "editor.html?id=" + encodeURIComponent(id);
}


/* ======================================
   DARK MODE
====================================== */

function setupTheme() {
    const button = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    updateThemeButton();

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        const theme = document.body.classList.contains("dark")
            ? "dark"
            : "light";

        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            console.error("Could not save theme:", error);
        }

        updateThemeButton();
    });
}

function updateThemeButton() {
    const button = document.getElementById("themeBtn");

    if (!button) {
        return;
    }

    const dark = document.body.classList.contains("dark");

    button.textContent = dark ? "☀" : "☾";
    button.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
    );
}


/* ======================================
   BOOKMARKS
====================================== */

function toggleBookmark(id) {
    id = Number(id);

    const bookmarks = getBookmarks();
    const alreadySaved = bookmarks.includes(id);

    const updated = alreadySaved
        ? bookmarks.filter(item => item !== id)
        : [...bookmarks, id];

    if (!writeJSON(BOOKMARK_KEY, updated)) {
        return;
    }

    const postPage = document.getElementById("postContainer");

    if (postPage) {
        displayPost();
    } else {
        renderBlogs();
    }
}


/* ======================================
   LIKES
====================================== */

function toggleLike(id) {
    id = Number(id);

    const blogs = getBlogs();
    const blog = blogs.find(item => Number(item.id) === id);

    if (!blog) {
        return;
    }

    const likedPosts = getLikedPosts();
    const alreadyLiked = likedPosts.includes(id);

    if (alreadyLiked) {
        blog.likes = Math.max(0, Number(blog.likes || 0) - 1);

        if (!writeJSON(LIKE_KEY, likedPosts.filter(item => item !== id))) {
            return;
        }
    } else {
        blog.likes = Number(blog.likes || 0) + 1;

        if (!writeJSON(LIKE_KEY, [...likedPosts, id])) {
            return;
        }
    }

    if (!saveBlogs(blogs)) {
        return;
    }

    const postPage = document.getElementById("postContainer");

    if (postPage) {
        displayPost();
    } else {
        renderBlogs();
    }
}


/* ======================================
   HOME PAGE: BLOG CARDS
====================================== */

let activeCategory = "All";
let showingBookmarks = false;

function renderBlogs() {
    const container = document.getElementById("blogContainer");

    if (!container) {
        return;
    }

    const searchInput = document.getElementById("searchInput");
    const search = (searchInput?.value || "").trim().toLowerCase();

    let blogs = getBlogs();

    if (activeCategory !== "All") {
        blogs = blogs.filter(blog => blog.category === activeCategory);
    }

    if (showingBookmarks) {
        const bookmarks = getBookmarks();

        blogs = blogs.filter(blog => bookmarks.includes(Number(blog.id)));
    }

    if (search) {
        blogs = blogs.filter(blog => {
            const searchable = [
                blog.title,
                blog.author,
                blog.category,
                blog.content
            ].join(" ").toLowerCase();

            return searchable.includes(search);
        });
    }

    // Show recently updated or created posts first.
    blogs.sort((a, b) => Number(b.id) - Number(a.id));

    container.innerHTML = "";

    const noBlogs = document.getElementById("noBlogs");
    const count = document.getElementById("blogCount");
    const title = document.getElementById("resultsTitle");
    const clearSearch = document.getElementById("clearSearch");

    if (count) {
        count.textContent = `${blogs.length} ${blogs.length === 1 ? "story" : "stories"}`;
    }

    if (title) {
        title.innerHTML = showingBookmarks
            ? 'Your saved stories <span class="heading-spark">♡</span>'
            : search
                ? 'Search results <span class="heading-spark">⌕</span>'
                : 'Latest stories <span class="heading-spark">✳</span>';
    }

    if (clearSearch) {
        clearSearch.hidden = !search;
    }

    if (noBlogs) {
        noBlogs.hidden = blogs.length !== 0;
    }

    blogs.forEach(blog => {
        const card = document.createElement("article");
        card.className = "blog-card";

        const id = Number(blog.id);
        const bookmarked = isBookmarked(id);
        const liked = isLiked(id);

        card.innerHTML = `
            <a class="blog-image-link" href="${getPostURL(id)}"
               aria-label="Read ${escapeHTML(blog.title)}">
                <img class="blog-image"
                     src="${escapeHTML(blog.image || DEFAULT_IMAGE)}"
                     alt="${escapeHTML(blog.title)}"
                     loading="lazy">
            </a>

            <div class="blog-card-content">
                <div class="card-topline">
                    <span class="category-label">${escapeHTML(blog.category)}</span>

                    <button class="bookmark-button ${bookmarked ? "bookmarked" : ""}"
                            data-bookmark="${id}"
                            aria-label="${bookmarked ? "Remove bookmark" : "Bookmark story"}"
                            aria-pressed="${bookmarked}">
                        ${bookmarked ? "♥" : "♡"}
                    </button>
                </div>

                <h3>
                    <a href="${getPostURL(id)}">${escapeHTML(blog.title)}</a>
                </h3>

                <p class="blog-excerpt">${escapeHTML(getExcerpt(blog.content))}</p>

                <div class="blog-info">
                    <span class="blog-author">${escapeHTML(blog.author)}</span>
                    <span>${escapeHTML(formatDate(blog.date))}</span>
                </div>

                <div class="card-bottom">
                    <a href="${getPostURL(id)}" class="read-more">Read story ↗</a>

                    <button class="like-button ${liked ? "liked" : ""}"
                            data-like="${id}"
                            aria-label="${liked ? "Unlike story" : "Like story"}"
                            aria-pressed="${liked}">
                        ${liked ? "♥" : "♡"} ${Number(blog.likes || 0)}
                    </button>
                </div>
            </div>
        `;

        const image = card.querySelector(".blog-image");

        image.addEventListener("error", () => {
            image.src = DEFAULT_IMAGE;
        }, { once: true });

        container.appendChild(card);
    });
}


/* ======================================
   HOME PAGE: SEARCH AND FILTERS
====================================== */

function setupHomePage() {
    const container = document.getElementById("blogContainer");

    if (!container) {
        return;
    }

    renderBlogs();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", renderBlogs);
    }

    const clearSearch = document.getElementById("clearSearch");

    if (clearSearch) {
        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            renderBlogs();
            searchInput.focus();
        });
    }

    const categoryFilters = document.getElementById("categoryFilters");

    if (categoryFilters) {
        categoryFilters.addEventListener("click", event => {
            const button = event.target.closest("[data-category]");

            if (!button) {
                return;
            }

            activeCategory = button.dataset.category;
            showingBookmarks = false;

            document.querySelectorAll("[data-category]").forEach(chip => {
                chip.classList.toggle("active", chip === button);
            });

            document.getElementById("bookmarksFilter")?.classList.remove("active");

            renderBlogs();
        });
    }

    const bookmarksFilter = document.getElementById("bookmarksFilter");

    if (bookmarksFilter) {
        bookmarksFilter.addEventListener("click", () => {
            showingBookmarks = !showingBookmarks;

            bookmarksFilter.classList.toggle("active", showingBookmarks);

            if (showingBookmarks) {
                activeCategory = "All";

                document.querySelectorAll("[data-category]").forEach(chip => {
                    chip.classList.toggle("active", chip.dataset.category === "All");
                });
            }

            renderBlogs();
        });
    }

    const resetFilters = document.getElementById("resetFilters");

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            activeCategory = "All";
            showingBookmarks = false;

            if (searchInput) {
                searchInput.value = "";
            }

            document.querySelectorAll("[data-category]").forEach(chip => {
                chip.classList.toggle("active", chip.dataset.category === "All");
            });

            bookmarksFilter?.classList.remove("active");

            renderBlogs();
        });
    }

    // Delegate like and bookmark button clicks.
    container.addEventListener("click", event => {
        const likeButton = event.target.closest("[data-like]");
        const bookmarkButton = event.target.closest("[data-bookmark]");

        if (likeButton) {
            toggleLike(Number(likeButton.dataset.like));
        }

        if (bookmarkButton) {
            toggleBookmark(Number(bookmarkButton.dataset.bookmark));
        }
    });
}


/* ======================================
   EDITOR: CREATE AND UPDATE BLOGS
====================================== */

function setupEditor() {
    const form = document.getElementById("blogForm");

    if (!form) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");
    const editing = editId !== null && /^\d+$/.test(editId);

    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const categoryInput = document.getElementById("category");
    const imageInput = document.getElementById("image");
    const contentInput = document.getElementById("content");

    const heading = document.getElementById("editorTitle");
    const publishButton = document.getElementById("publishBtn");
    const message = document.getElementById("formMessage");
    const wordCount = document.getElementById("wordCount");

    let originalBlog = null;

    if (editing) {
        originalBlog = getBlogs().find(
            blog => Number(blog.id) === Number(editId)
        );

        if (!originalBlog) {
            heading.textContent = "Story not found.";
            message.textContent = "This story may have been deleted.";
            publishButton.disabled = true;
            return;
        }

        heading.textContent = "Edit your story.";
        publishButton.textContent = "Save changes ↗";

        titleInput.value = originalBlog.title;
        authorInput.value = originalBlog.author;
        categoryInput.value = originalBlog.category;
        imageInput.value = originalBlog.image || "";
        contentInput.value = originalBlog.content;
    }

    function updateWordCount() {
        wordCount.textContent = getWordCount(contentInput.value);
    }

    contentInput.addEventListener("input", updateWordCount);
    updateWordCount();

    form.addEventListener("submit", event => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const category = categoryInput.value;
        const image = imageInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !author || !category || !content) {
            message.textContent = "Please complete all required fields.";
            return;
        }

        if (image) {
            try {
                const parsedURL = new URL(image);

                if (!["http:", "https:"].includes(parsedURL.protocol)) {
                    message.textContent = "Please enter a valid HTTP or HTTPS image URL.";
                    return;
                }
            } catch {
                message.textContent = "Please enter a valid image URL.";
                return;
            }
        }

        const blogs = getBlogs();

        if (editing) {
            const index = blogs.findIndex(
                blog => Number(blog.id) === Number(editId)
            );

            if (index === -1) {
                message.textContent = "This story no longer exists.";
                return;
            }

            blogs[index] = {
                ...blogs[index],
                title,
                author,
                category,
                image: image || DEFAULT_IMAGE,
                content,
                updatedAt: new Date().toISOString()
            };
        } else {
            blogs.push({
                id: Date.now(),
                title,
                author,
                category,
                image: image || DEFAULT_IMAGE,
                content,
                date: new Date().toISOString().slice(0, 10),
                likes: 0
            });
        }

        if (!saveBlogs(blogs)) {
            message.textContent = "The story could not be saved.";
            return;
        }

        window.location.href = editing
            ? getPostURL(editId)
            : "index.html";
    });
}


/* ======================================
   ARTICLE PAGE
====================================== */

function displayPost() {
    const container = document.getElementById("postContainer");

    if (!container) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const rawId = params.get("id");

    if (!rawId || !/^\d+$/.test(rawId)) {
        showPostNotFound(container);
        return;
    }

    const id = Number(rawId);
    const blog = getBlogs().find(item => Number(item.id) === id);

    if (!blog) {
        showPostNotFound(container);
        return;
    }

    document.title = blog.title + " — BlogSphere";

    const liked = isLiked(id);
    const bookmarked = isBookmarked(id);

    container.innerHTML = `
        <header class="article-header">
            <span class="category-label">${escapeHTML(blog.category)}</span>

            <h1 class="article-title">${escapeHTML(blog.title)}</h1>

            <div class="article-meta">
                <span>By <strong>${escapeHTML(blog.author)}</strong></span>
                <span>·</span>
                <span>${escapeHTML(formatDate(blog.date))}</span>
            </div>
        </header>

        <img class="article-cover"
             src="${escapeHTML(blog.image || DEFAULT_IMAGE)}"
             alt="${escapeHTML(blog.title)}">

        <div class="article-toolbar">
            <button class="button button-secondary ${liked ? "liked" : ""}"
                    id="postLike"
                    aria-pressed="${liked}">
                ${liked ? "♥ Liked" : "♡ Like"} · ${Number(blog.likes || 0)}
            </button>

            <button class="button button-secondary ${bookmarked ? "bookmarked" : ""}"
                    id="postBookmark"
                    aria-pressed="${bookmarked}">
                ${bookmarked ? "♥ Saved" : "♡ Save for later"}
            </button>

            <a href="${getEditorURL(id)}" class="button button-secondary">✎ Edit story</a>
        </div>

        <div class="article-body">${escapeHTML(blog.content)}</div>

        <div class="article-author">
            <h3>Written by ${escapeHTML(blog.author)}</h3>
            <p>Thanks for taking the time to read this story on BlogSphere.</p>
        </div>

        <div style="margin-top: 30px;">
            <a href="index.html" class="text-link">← Explore more stories</a>
        </div>
    `;

    const image = container.querySelector(".article-cover");

    image.addEventListener("error", () => {
        image.src = DEFAULT_IMAGE;
    }, { once: true });

    document.getElementById("postLike").addEventListener("click", () => {
        toggleLike(id);
    });

    document.getElementById("postBookmark").addEventListener("click", () => {
        toggleBookmark(id);
    });
}

function showPostNotFound(container) {
    container.innerHTML = `
        <div class="article-not-found">
            <div class="empty-icon">✳</div>
            <h2>Story not found</h2>
            <p>This story may have been deleted or the link may be incorrect.</p>
            <a href="index.html" class="button button-primary">Back to home</a>
        </div>
    `;
}


/* ======================================
   FOOTER YEAR
====================================== */

function setupFooter() {
    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
}


/* ======================================
   INITIALIZE WEBSITE
====================================== */

document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    setupFooter();
    setupHomePage();
    setupEditor();
    displayPost();
});