// promise -> pending, resolve(success), reject(error)
const categoryContainer = document.getElementById("categoryContainer")
const newsContainer = document.getElementById("newsContainer")
const bookmarkContainer = document.getElementById("bookmarkContainer")
const bookmarkCount = document.getElementById("bookmarkCount")
const newsDetailsModal = document.getElementById('news-details-modal')
const modalContainer = document.getElementById('modalContainer')

//console.log(categoryContainer)
let bookmarks = []
const loadCategory = () =>{
    fetch("https://news-api-fs.vercel.app/api/categories")
    .then((res) => res.json())
    .then((data) =>{
        const categories = data.categories;
       // console.log(categories)
        showCategory(categories);
    })
    .catch((err) =>{
        console.log(err)
    });
};

const showCategory = (categories) =>{
 categoryContainer.innerHTML = "";
    categories.forEach((cat) => {
        categoryContainer.innerHTML += `
            <li id="${cat.id}" class="hover:border-b-4 hover:border-red-600 border-red-600 cursor-pointer">${cat.title}</li> `
        ;
    });
}
categoryContainer.addEventListener("click", (e) =>{
    const allLi = document.querySelectorAll("li")

    allLi.forEach((li) =>{
        li.classList.remove("border-b-4")
    });

    if(e.target.localName ==="li"){
        e.target.classList.add("border-b-4");
        loadNewsByCategory(e.target.id)
       // console.log(e.target.id)
    }
})
const loadNewsByCategory = (categoryId) =>{
    fetch(`https://news-api-fs.vercel.app/api/categories/${categoryId}`)
    .then((res) => res.json())
    .then((data) =>{
       // console.log(data)
        showNewsByCategory(data.articles)
    })
    .catch((err) =>{
       showError() 
    })
}

const showNewsByCategory = (articles) =>{
    if(articles.length === 0){
        showEmptyMessage()
        // alert('No news found for this category!')
       return 
    }
    newsContainer.innerHTML="";
    articles.forEach((article) => {
    //console.log(articles)
      newsContainer.innerHTML += `
        <div class="border  border-gray-300 rounded-lg">
            <div>
             <img src="${article.image.srcset[5].url}"/>
            </div>
            <div id="${article.id}" class="p-2">
                <h1 class="font-extrabold">${article.title}</h1>
            <p class="text-sm">${article.time}</p>
                 <button class="btn">Bookmark</button>
                   <button class="btn">View Details</button>
            </div>
        </div>
        `;
    })
}
newsContainer.addEventListener("click", (e) =>{
   if(e.target.innerText === "Bookmark"){
    handleBookmarks(e)
   }

   if(e.target.innerText === "View Details"){
    handleViewDetails(e)
   }
})
const handleBookmarks = (e) => {
    const title = e.target.parentNode.children[0].innerText;
    const id = e.target.parentNode.id;

    bookmarks.push({
        title: title,
        id: id,
    })
    showBookmarks(bookmarks);
};

const showBookmarks = (bookmarks) =>{
    console.log(bookmarks)
    bookmarkContainer.innerHTML = "";
    bookmarks.forEach(bookmark =>{
        bookmarkContainer.innerHTML += `
        <div class="border my-2 p-1">
        <h1> ${bookmark.title}</h1>
        <button onclick="handleDeleteBookmark('${bookmark.id}')" class = "btn btn - xs">Delete</button>
        </div>
        `
    })
    bookmarkCount.innerText = bookmarks.length;
}
handleViewDetails = (e) =>{
    const id = e.target.parentNode.id;

    fetch(`https://news-api-fs.vercel.app/api/news/${id}`)
    .then((res) => res.json())
    .then((data) =>{
       showDetailsNews(data.article)
    })
    .catch(err =>{
        console.log(err)
    })
}
const showDetailsNews = (articles) =>{
    newsDetailsModal.showModal()
    modalContainer.innerHTML =`
    <h1> ${articles.title}</h1>
    <img src="${articles.images[0].url}"/>
    <p>${articles.content.join("")}</p>
    `
}
const handleDeleteBookmark = (bookmarkId) =>{
    const filterBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId)
    bookmarks = filterBookmarks;
    showBookmarks(bookmarks);
}
const showError = () => {
    newsContainer.innerHTML = `
     <div class="bg-red-500 p-3 ">Something went wrong</div>
    `
}
const showEmptyMessage = () => {
        newsContainer.innerHTML = `
     <div class="bg-orange-500 p-3 ">No news found for this category</div>
    `
}
const showLoading = () => {
    newsContainer.innerHTML = `
     <div class="bg-green-500 p-3 ">Loading...</div>
    `
}
loadCategory();
loadNewsByCategory("main");