### Chris Young | IS 542 | Project 1  
  
In this project, I learned:
* How to segment code into separate, specific functions. In this project, I really saw the power and flexibility of having separate functions for each task/feature that you want in your code. It was really interesting to see how you can pass variables to a function that creates an HTML element. With these simple functions, code becomes much more elegant and efficient, rather than being so repetitive.
* How to navigate using the global `location.hash`. Before this project I had no idea what the `window` object was and that you can use some of its properties, like `location.hash` to navigate pages and the site itself. This was extremely useful when implementing previous/next chapter buttons in my project.
* How to use and add custom markers to the Google Maps API. It was extremely cool to use the Google Maps API to create my own custom map for this site. I would love to dive deeper into the API and learn more about the different styles and additional custom measures you can apply.
* How to set custom bounds and zoom levels for Google Maps. It was really satisfying to figure out how to use the Google Map properties to set the zoom and center on a collection of location markers. I found an object to set boundaries `let bounds = new google.maps.LatLngBounds()`, then used `bounds.extend(marker.getLocation())` and the `map.fitBounds(bounds)` to accomplish this.

Some additional features that I included in this project are:
1. Breadcrumb navigation between volumes, books, and chapters
2. Chapter navigation with previous and next icons.
3. A reset map icon that resets map zoom after clicking on a specific geolocation.
4. Custom labels that allow much better readability on the map.

Things to work on:
* Better styling for the volume, book, chapter content.
* Better transitions between navigation
* Additional map styling.

