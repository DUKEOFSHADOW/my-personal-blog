// 模拟博客文章数据
const posts = [
    { id: 1, title: "我的第一篇博客", date: "2024-07-01", content: "这是我的第一篇博客文章内容。我很高兴开始写博客！", comments: [{ author: "访客A", text: "欢迎！", date: "2024-07-01" }] },
    { id: 2, title: "JavaScript 学习心得", date: "2024-07-05", content: "JavaScript 是一门非常强大的语言...", comments: [] },
    { id: 3, title: "CSS 布局技巧", date: "2024-07-10", content: "分享一些 CSS 布局的实用技巧，例如 Flexbox 和 Grid。", comments: [{ author: "访客B", text: "很有用！", date: "2024-07-11" }] },
    { id: 4, title: "关于 Web 开发的未来", date: "2024-07-15", content: "Web 开发技术日新月异，未来可期。", comments: [] },
    { id: 5, title: "旅行日记：山水之间", date: "2024-07-20", content: "记录了一次难忘的旅行经历。", comments: [] },
    { id: 6, title: "美食探店：城市角落的味道", date: "2024-07-25", content: "发现了一家隐藏在城市角落的美食店。", comments: [] }
];

const POSTS_PER_PAGE = 3; // 每页显示的文章数量
let currentPage = 1; // 当前页码

// DOMContentLoaded 事件确保在操作 DOM 前，HTML 已完全加载和解析
document.addEventListener('DOMContentLoaded', () => {
    // 根据当前页面路径执行不同的初始化函数
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/D:/Desktop/work/blog/') {
        loadLatestPosts(); // 加载首页最新文章
    }
    if (window.location.pathname.endsWith('blog.html')) {
        displayPosts(posts, currentPage); // 加载博客列表页文章
        setupPagination(posts); // 设置分页
    }
    if (window.location.pathname.endsWith('post.html')) {
        loadPostDetail(); // 加载文章详情页
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', handleCommentSubmit);
        }
    }
    if (window.location.pathname.endsWith('contact.html')) {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
    }
});

// 加载首页最新文章（简单示例，实际可调整逻辑）
function loadLatestPosts() {
    const latestPostsContainer = document.querySelector('#latest-posts .post-list');
    if (!latestPostsContainer) return;

    const latest = posts.slice(0, 2); // 获取最新的两篇文章
    latestPostsContainer.innerHTML = ''; // 清空现有内容
    latest.forEach(post => {
        const postElement = document.createElement('article');
        postElement.innerHTML = `
            <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
            <p>${post.content.substring(0, 100)}...</p>
            <span>发布日期: ${post.date}</span>
        `;
        latestPostsContainer.appendChild(postElement);
    });
}

// 显示文章列表（支持分页）
function displayPosts(postsToDisplay, page) {
    const postListContainer = document.getElementById('blogPostListContainer');
    if (!postListContainer) return;

    postListContainer.innerHTML = ''; // 清空现有内容
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = postsToDisplay.slice(startIndex, endIndex);

    paginatedPosts.forEach(post => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
            <p>${post.content.substring(0, 150)}...</p>
            <span>发布日期: ${post.date}</span>
        `;
        postListContainer.appendChild(article);
    });
}

// 设置分页
function setupPagination(postsToPaginate) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = ''; // 清空现有分页按钮
    const pageCount = Math.ceil(postsToPaginate.length / POSTS_PER_PAGE);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            displayPosts(postsToPaginate, currentPage);
            // 更新激活的按钮状态
            const currentActive = paginationContainer.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            button.classList.add('active');
        });
        paginationContainer.appendChild(button);
    }
}

// 加载文章详情
function loadPostDetail() {
    const postDetailContainer = document.getElementById('post-detail');
    const commentListContainer = document.getElementById('comment-list');
    if (!postDetailContainer || !commentListContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    const post = posts.find(p => p.id === postId);

    if (post) {
        document.title = `${post.title} - 我的个人博客`; // 更新页面标题
        postDetailContainer.innerHTML = `
            <h1>${post.title}</h1>
            <p class="post-meta">发布日期: ${post.date}</p>
            <div class="post-content">
                ${post.content.split('\n').map(p => `<p>${p}</p>`).join('')}
            </div>
        `;
        loadComments(post);
    } else {
        postDetailContainer.innerHTML = "<p>未找到文章。</p>";
    }
}

// 加载评论
function loadComments(post) {
    const commentListContainer = document.getElementById('comment-list');
    if (!commentListContainer) return;

    commentListContainer.innerHTML = ''; // 清空现有评论
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `
                <p class="comment-author">${comment.author} <span class="comment-date">(${comment.date})</span></p>
                <p>${comment.text}</p>
            `;
            commentListContainer.appendChild(commentDiv);
        });
    } else {
        commentListContainer.innerHTML = "<p>暂无评论。</p>";
    }
}

// 处理评论提交
function handleCommentSubmit(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const commenterNameInput = document.getElementById('commenter-name');
    const commentTextInput = document.getElementById('comment-text');

    const commenterName = commenterNameInput.value.trim();
    const commentText = commentTextInput.value.trim();

    if (!commenterName || !commentText) {
        alert('名字和评论内容不能为空！');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    const post = posts.find(p => p.id === postId);

    if (post) {
        const newComment = {
            author: commenterName,
            text: commentText,
            date: new Date().toLocaleDateString('zh-CN') // 获取当前日期
        };
        post.comments.push(newComment);
        loadComments(post); // 重新加载评论列表

        // 清空表单字段
        commenterNameInput.value = '';
        commentTextInput.value = '';

        alert('评论已提交！');
    } else {
        alert('无法找到对应的文章来提交评论。');
    }
}

// 处理联系表单提交
function handleContactFormSubmit(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('请填写所有必填项！');
        return;
    }

    // 此处可以添加发送邮件或保存到后端的逻辑
    // 对于纯前端，我们仅显示一个成功消息
    alert(`感谢您的留言，${name}！我们会尽快回复您。`);

    // 清空表单
    document.getElementById('contact-form').reset();
}

// 搜索文章功能
function searchPosts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        // 如果在博客列表页，则显示所有文章
        if (window.location.pathname.endsWith('blog.html')) {
            currentPage = 1;
            displayPosts(posts, currentPage);
            setupPagination(posts);
        }
        return;
    }

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
    );

    // 如果当前不是博客列表页，则跳转到博客列表页并显示搜索结果
    if (!window.location.pathname.endsWith('blog.html')) {
        // 将搜索结果存储到 localStorage，以便在 blog.html 页面加载时读取
        localStorage.setItem('searchResults', JSON.stringify(filteredPosts));
        localStorage.setItem('searchTerm', searchTerm); // 也保存搜索词，以便在目标页面显示
        window.location.href = `blog.html?search=true`; 
    } else {
        // 如果已经在博客列表页，则直接显示结果
        currentPage = 1;
        displayPosts(filteredPosts, currentPage);
        setupPagination(filteredPosts);
        // 可以选择性地在页面上显示搜索词
        const blogListTitle = document.querySelector('#blog-list h1');
        if (blogListTitle) {
            blogListTitle.textContent = `搜索结果: "${searchTerm}"`;
        }
    }
}

// 在 blog.html 加载时检查是否有搜索结果需要显示
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('blog.html') && new URLSearchParams(window.location.search).has('search')) {
        const searchResults = JSON.parse(localStorage.getItem('searchResults'));
        const searchTerm = localStorage.getItem('searchTerm');
        if (searchResults) {
            currentPage = 1;
            displayPosts(searchResults, currentPage);
            setupPagination(searchResults);
            const blogListTitle = document.querySelector('#blog-list h1');
            if (blogListTitle && searchTerm) {
                blogListTitle.textContent = `搜索结果: "${searchTerm}"`;
            }
            // 清除 localStorage 中的搜索结果，避免下次直接加载
            localStorage.removeItem('searchResults');
            localStorage.removeItem('searchTerm');
        }
    }
});

// 为导航栏的搜索按钮添加事件监听器（如果存在）
// 这个需要在 DOMContentLoaded 之后执行，或者直接在 HTML 中使用 onclick
// 为了确保按钮存在，我们再次在 DOMContentLoaded 中查找
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-container button');
    if (searchButton && !searchButton.onclick) { // 避免重复绑定
        searchButton.addEventListener('click', searchPosts);
    }

    // 如果搜索输入框存在，监听 Enter 键
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchPosts();
            }
        });
    }
});