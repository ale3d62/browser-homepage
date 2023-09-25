// Note: having length != 4 (+1 for extras) will mess with layout based on how the site is styled
// The bookmarks in the "Extras" section will appear in the extra-bookmarks popup
const bookmarks = [
  {
    title: "Personal",
    links: [
      { name: "Whatsapp", url: "https://web.whatsapp.com/" },
      { name: "Calendar", url: "https://calendar.google.com/calendar/u/0/r" },
      { name: "Gmail", url: "https://mail.google.com/mail/u/0/#inbox", },
      { name: "Notion", url: "https://www.notion.so/ale3d62/Personal-3cfd62dda13341318db05483bcbb2651", },
      { name: "Photos", url: "https://photos.google.com/"},
      { name: "Drive", url: "https://drive.google.com/drive/u/0/my-drive" },
    ],
  },
  {
    title: "Media",
    links: [
      { name: "Youtube", url: "https://youtube.com" },
      { name: "Twitch", url: "https://www.twitch.tv/" },
      { name: "Twitter", url: "https://twitter.com/home" },
      { name: "Github", url: "https://github.com/" },
      { name: "SoundCloud", url: "https://soundcloud.com/you/library"},
      { name: "Reddit", url: "https://www.reddit.com/" },
      { name: "Wallhaven", url: "https://wallhaven.cc/search?categories=100&purity=000&topRange=1M&sorting=toplist&order=desc&ai_art_filter=1&page=2" },
      { name: "Instagram", url: "https://www.instagram.com/" },
    ],
  },
  {
    title: "Studies",
    links: [
      {name: "Campus", url: "https://campusvirtual.uca.es/es/intranet/login" },
      { name: "Notion", url: "https://www.notion.so/ale3d62/Universidad-6ee11fbe3feb435d82dbf1ef12a56d02" },
      { name: "Gmail", url: "https://mail.google.com/mail/u/2/#inbox", },
      { name: "Drive", url: "https://drive.google.com/drive/u/1/my-drive" },
      { name: "Wuolah", url: "https://www.wuolah.com/es/universidad-de-cadiz/uca-escuela-superior-de-ingenieria" },
    ],
  },
  {
    title: "Tools",
    links: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "Translator", url: "https://www.deepl.com/translator" },
      { name: "Type", url: "https://monkeytype.com/" },
      { name: "PDF", url: "https://www.sejda.com/" },
    ],
  },
  {
    title: "Extras",
    links: [
      { name: "Miro - Online diagram maker", url: "https://miro.com/app/dashboard/" },
      { name: "The open source computer-sience degree", url: "https://github.com/ossu/computer-science" },
      { name: "Remini - Ai photo enhancer", url: "https://app.remini.ai"},
      { name: "PSU Tier List", url: "https://cultists.network/140/psu-tier-list/"}
    ],
  },
];



// Handle writing out Bookmarks
function setupBookmarks() {
  const bookmarkContainer = document.getElementById("bookmark_container");
  const extraBookmarksContainer = document.getElementById("extra_bookmarks_container");
  
  //inject html
  var html = "";
  var extraBookmarksHtml = "";

  //for each bookmark
  for(const [i, bookmarkType] of bookmarks.entries()){
    if(bookmarkType['title'] != "Extras"){
      html+= "<div class='bookmark-set'>";
      html+= "<div class='bookmark-title'>"+bookmarkType['title']+"</div>";
      html+= "<div class='bookmark-inner-container'>";
      for(j in bookmarkType['links']){
        bookmark = bookmarkType['links'][j];
        html+= "<a class='bookmark' href="+bookmark['url']+" target='_self'>"+bookmark['name']+"</a>";
      }
      html+="</div></div>";
    }
    else{
      for(j in bookmarkType['links']){
        bookmark = bookmarkType['links'][j];
        extraBookmarksHtml+= "<a class='bookmark' href="+bookmark['url']+" target='_self'>"+bookmark['name']+"</a>";
      }
    }
  }
  bookmarkContainer.innerHTML = html;
  extraBookmarksContainer.innerHTML = extraBookmarksHtml;

  //Buttons html
  html = "<div class='bookmark-button-set'>";
  //extra bookmarks button
  html+=  "<div class='bookmark-button-container top'>";
  html+=    "<button id='extra_bookmarks_button' class='button bookmark-button'><i class='fa fa-plus'></i></button>";
  html+=  "</div>"
  //wallpaper menu button
  html+=  "<div class='bookmark-button-container'>";
  html+=    "<button id='wallpapers_button' class='button bookmark-button'><i class='fa fa-image'></i></button>";
  html+=  "</div>"
  //settings button
  html+=  "<div class='bookmark-button-container'>";
  html+=    "<button id='settings_button' class='button bookmark-button'><i class='fa fa-gear'></i></button>";
  html+=  "</div>";
  html+= "</div>";
  bookmarkContainer.innerHTML += html;
}

setupBookmarks();