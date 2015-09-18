## Teleprompter ##

Karaoke Research Council's modification of Peter Schmalfeldt's excellent HTML5/Javascript teleprompter.

You can edit the text right on the page. It'll even save your changes for you if you happen to leave the page.

If you're using an iPad, you can add a shortcut to your home screen for full screen awesomeness.

You can also use some handy keyboard shortcuts. You can adjust the speed & font size at the top right as well. I'm also experimenting with ways to flip the text around for you fancy folks using mirrors.

A new feature, requested by [Richard Di Brittannia](https://soundcloud.com/rdbritannia), allows you to change the colors of the text and background for situations where it might make things easier for you.  Changes are of course saved automatically.  ( Make sure you clear your browsers cache if you do not see these changes )

## Now Available @ [http://karaokeresearch.github.io/teleprompter-krcmod](http://karaokeresearch.github.io/teleprompter-krcmod) ##


## Keyboard Shortcuts ##

- **+**: Increases Font Size
- **-**: Decreases Font Size
- **Left**: Slows Down Teleprompter
- **Right**: Speeds Up Teleprompter
- **Space**: Starts / Stops Teleprompter
- **Escape**: Resets GUI

Finally, we also made an effort to make sure your text will be easy to read.   So if you are pasting text from a word document, we'll do some cleaning up to make the breaks flow more easily.

Follow Peter Schmalfeldt on Twitter for updates: **[@mrmidi](http://twitter.com/mrmidi "Follow @mrmidi on Twitter")**

## Modifications made by the Karaoke Research Council ##

- Commented out the overlay and the header darkening. They're cool, but not the right fit for my TV show.  Uncomment line 267 and 268  to restore that functionality. Eventually, we can have a hotkey to enable it.
- Made the entire project work locally since our teleprompter computer is not Internet connected. Downloaded all supporting libraries and fonts. Added license notices where necessary. 
- Replaced cookie calls with localstorage since localstorage works without a webserver. Entire project can now be run locally and it will remember settings between refreshes.
- Made the keyboard work in a more reasonable way when it's playing. You don't have to click in weird places to make the keyboard shortcuts work anymore using a weird focus trick I discovered. I'm still not totally sure what's up with that. Changed up and down to actually scroll up and down. Font size is controlled by + and -. It's instinctual to want to use up and down to *go* up and down, so I put in that behavior. 
- Sped up the prompter to 2 pixels per tick so it has a faster max speed on this crappy old laptop and changed the range so it can run slower as well. Changed the speed interval to 10. Speed of zero now effectively pauses the prompter.