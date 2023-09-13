# Robin of Thirteensley

> The year is Nineteen Seventy Thirteen. The personal computer craze is just starting to really take off, and the most popular computers sold are... video games consoles. Inspired minds around the globe are racing to invent the future, and hungry corporations are eager to fund them.
> You're a streetwise 13 year old, browsing casually through the broad aisles of ToysRSus, when you turn the corner into the gaming isle and there it is: Robin of Thirteensley, running on a demo station. The gigantic 13kb cartridge, you learn from the prominently placed sticker, hosts untold adventure; basically the most realistic video game ever made. Your world narrows into focus: You. Must. Play. This game.


Robin of Thirteensley is a tiny vintage adventure game made for the [JS13K](https://js13kgames.com/) competition in 2023. As the name suggests, the competition is about writing a game in just 13Kb of JavaScript code.

You can [play the game in your browser!](https://csubagio.github.io/js13k-robin/index.html). As of the writing, it's pretty standard web fare: Canvas 2D + WebGL + WebAudio, with an AudioWorker. This should run in most desktop browsers.

My goal this year was to create a miniature game, with miniaturized versions of traditional processes from the early days of gaming. I ended up animating sprites in Aseprite, and then exporting those to packed 1bit (almost everything) or 2bit (the player sprite) Base64 encoded buffers. The game has a single palette, so that could be omitted from individual sprites.

I was initially going to do some traditional sound design, but fell down a Karplus-Strong rabbit hole, and so the all sounds come from a pair of acoustic sounding guitars. They don't fit the retro theme at all, but let's just pretend that the fantasy early 80s console it's playing on had a bizzarely specific string synth built in?

Plain 1-bit pixel art wasn't quite hitting the spot, so I wrapped the canvas in a WebGL shader that adds gratuitous scanlines and abberations.

The code is written in TypeScript, minified in Terser, then passed through Roadroller for a final squeeze before getting zipped down to its final 12.2kb.

Thank you for trying my game!

--Chris.
