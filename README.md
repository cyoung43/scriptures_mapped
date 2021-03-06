## Chris Young | IS 542 | Project 2
I learned several things through the course of this project. I have never felt 'great' at layout, animation, and general UX principles. However, by working on this project and getting feedback from friends and family, I was able to implement their suggestions and make my site a better experience for users.

### What I Learned:
* JQuery: I have never previously used jQuery in my projects. I had never thought to use jQuery previously, and was actually not quite sure what I could do with it. Now however, I have learned that I can use jQuery to directly manipulate the DOM. Without jQuery in this project, I likely would have been unable to implement the transitions and animations between chapter content in the html. Things I specifically utilized jQuery for were `$(#s1).animate`, `$(#s1).html`, and `$('#s1').css`. Another very helpful piece I learned was that jQuery items execute simultaneously (as far as I understand). This is what makes the animation and cross-fading in my project possible.
* CSS: I learned a lot about css positioning and how to use these position elements to aid animation. I have never used flex positioning (I have generally used Bootstrap grid with `rows` and `cols`). It is very helpful to use percentages when describing flex rules because it will easily adapt to different screen sizes. I thought it was very clever to move the scripture divs around to on and off the "screen" while working with animations.
* I learned about `@media` queries. I have seen these frequently, but have never required the use of them in any of my prior projects. While my understanding still seems limited (I only used it for querying screen sizes), media queries actually have a lot of power to select custom rules for what you want. MDN says `Media features describe specific characteristics of the user agent, output device, or environment. Media feature expressions test for their presence or value, and are entirely optional.`
* I also learned about modularization and how to divide my code into logical segments. While implementing the transitions, I had to use a `setter` and `getter` to access the old hash value (from which I determined if I needed to slide right or left). I found this interesting to work with across modules, but eventually figured it out.

### Project Extra Features
For this project I added the following additional features:
1. Customized the CSS to use my own color themes and button animations (also integrated Bootstrap into the project).
2. Utilized 3 media queries to specify screen-size rules (`<600px; <740px; >741px;`)
3. On the smallest media queries, I used Bootstrap's `collapse` classes to add buttons for the user to collapse either the scriptures or the map, depending on preferences. This was also included in the medium-sized screens. I felt like this enhanced the UX for users to see more clearly their interest on the site, whether that be additional map or scripture size.

### Summary
All in all, I really enjoyed this piece of the project because it was definitely out of my comfort zone and I feel like I learned a lot about css and styling in this project.
