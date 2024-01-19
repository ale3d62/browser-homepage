# Browser Homepage

### [Original code by Jaredk3nt](https://github.com/Jaredk3nt/homepage)

![homepage](https://github.com/ale3d62/browser-homepage/blob/local/readmegif.gif?raw=true)

## Extra Functionalities

### Search
The search accepts both normal searches and direct url searches, just like a navigation bar of any browser would. Normal searches use a determined search engine that can be selected as explained in the [Customize Search Engine](#customize-search-engine) section.

### Popups
Three popup buttons have been added to the right of the bookmarks. The first one is used for extra bookmarks that the user may not want to be visible at all times, to include bookmarks in this section, check the [Customize Bookmarks](#customize-bookmarks) section.

The other two popups are a wallpaper selector, and a settings popup, the wallpaper selector will be described further in the [HomeServer](#homeserver) section.

### Wled integration
The Homepage allows the integration of smart lighting devices using the [WLED](https://kno.wled.ge/) implementation. Devices can be added through the settings popup to then have a button where they can be individually turned on or off, as well as checking their current color.

### HomeServer
The proyect relies heavily on a [python script](https://github.com/ale3d62/homeServerAPI) running on my home server, which provides the homepage with all sorts of extra functions, which are mostly based on synchronization with my other devices. Such a script is recommended, but not mandatory.

The functionalities linked to this script are the following:

 - ToDo list synced between all devices that are using the homepage
 - 

## Customization

### Customize Bookmarks

Bookmarks can be configured in the `bookmarks.js` file. `bookmarks` is an array of objects with a `title` and `links` property. The `title` defines what the header of the "bookmark section" box will be. `link` is an array of link objects each with a name and a url to link to.

Bookmarks that are displayed in the Extra Bookmarks popup should be included in the "Extras" title array.

> The way the site is currently styled, bookmarks should always have a length of `4`. If you want to have more sections, you need to change the `width` property of the css class `bookmark-set`

### Customize Search Engine

You can change the search engine used by the search overlay by updating the url value stored in the `searchUrl` var in `search.js` to the correct string for your engine.

Examples:

- Google: `https://google.com/search?q=`
- DuckDuckGo: `https://duckduckgo.com/?q=`
- Bing: `https://www.bing.com/search?q=`

### Customize Styling

Styles are handled through CSS variables. To update the colors you just need to change the variable definitions defined in `:root` at `styles.css`.

| Variable           | default                    | description                                                                                                                |
| ------------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `--bg`             | `#5f4b8b`                  | Defines the body background color                                                                                          |
| `--fg`             | `#ffffff`                  | Defines the primary foreground (text) color for clock, weather, and titles                                                 |
| `--secondaryFg`    | `#b3b3b3`                  | Defines the foreground (text) color for links                                                                              |
| `--containerBg`    | `#272727`                  | Defines the background color of the boxes                                                                                  |
| `--searchBg`       | `--containerBg`            | Defines the background color of the search overlay                                                                         |
| `--scrollbarColor` | `#3f3f3f`                  | Defines the color of the custom scrollbars                                                                                 |
| `--scrollbarHoverColor` | `#505050`             | Defines the color of the custom scrollbars when hovered                                                                    |
| `--inputBg`        | `#363636`                  | Defines the color of the input fields                                                                                      |
| `--inputHoverBg`   | `#363636`                  | Defines the color when hovering the input fields                                                                           |
| `--buttonBg`       | `--inputBg`                | Defines the color of the buttons background                                                                                |
| `--buttonHoverBg`  | `--inputHoverBg`           | Defines the color of the buttons background when hovering                                                                  |
| `--fontFamily`     | `"Roboto Mono", monospace` | Defines the font used. To change to a custom font you will also have to import that font from whatever source is available |

