import { useState, useEffect, useRef } from "react";
import Switch from "../Switch/Switch";
import CardCarousel from "../CardCarousel/CardCarousel";
import "./App.scss";

//ToDo:
// tinker with card vertical alignment on desktop... not quite the right spacing on top.

// Sticky Controls - make controls attached to or in the same static space as the progress bar. Will always be in view. Make the background gradient out along the bottom so page text scrolls behind it.

// reverse toggle and label location? keep center vert rule?

// add third or fourth

// in addition... maybe this space could be used to fade in/out messages with the controls?

// MOBILE OPTIMIZATIONS:
// OPTIMIZE MOBILE maybe turn off opacity on mobile as well? make simple?

// OPTIMIZE MOBILE use devtools to investigate if I have too heavy css operations causing repaints, etc... maybe just render the integer grid for each individual card instead of all of them? Ask tim? ISSUES ONLY OCCUR WITH DYSLEXIA... IT HAS TO BE BECAUSE OF THE ICONGRID

// MESSAGING: design where occurs. tune up progress success messaging. glitches back and fourth... maybe round the number up with ceiling to make it exact, or set to 10.5? Could also add a callback timer function to wait a second before applying. too fluid at the moment, the text bounces back and forth between text. Also animate this text in and have it disappear again. Don't want to disappear too quickly... kids can't read that fast, can't be like subtitles, need time to process the words.

// use has() all siblings besides the current slide to animate opacity and scale? See wes bos has() post.

// CARD BACKS:
// utilize stock imagery?
// text shadow on the icon for dimension?
// add a texture to backgrounds, like space... stars or horizontal gradients
// de-saturate and stylize the icon on the back of the card? Maybe 1 large barely visible in the card center or along the edges/corners
// is it possible to get the html emoticons in svg format? Then could make the robot's light flash or something when selected is active...

// ACCESSIBILITY WORK *********
// SOLVED: Accessibility focus tabbing is buggy. Is it the viewport mask? Chrome: works, FF: works, Saf: tabs through but focus doesn't seem to follow and seems to remain on a previous card.. also cards are skipping order... but make sense when go backward...
// refer focus issue from this comment. https://github.com/davidjerleke/embla-carousel/issues/239#issuecomment-10730093740. This might be causing issues with safari focus state
// User test fonts... use open-dyslexic? https://opendyslexic.org/

// BUGS
// progress bar buggy, sometimes doesn't show up until rage click a few slides in
// FF, tab focus-visible on switch is not working when the checkbox is visually hidden. Google how to get around this issue. It has to be a common problem.
// fix opacity transition when card returns to front after selected
// where are all the tailwind css variables coming from? They load over and over again. Only exist in package.lock. Possibly a dependency of a third party? Embla?

// TOUCH UP / CLEAN UP ************
// make breakpoint mixins use sass variables
// remove unnecessary font size variables
// remove comments and console logs
// consolidate text sizes and add for 16rem
// performance enhancements on mobile... dyslexic version is choppy, try: text-rendering: optimizeSpeed; or will-change: transform... or don't transform icons at all.
// Only do icon animations on desktop. Mobile is too much it causes chop.
// does "selected" need to be a state variable? or just a js toggle? It will remember which card is flipped over. Might be more performant to use JS and basic css instead of state var. Experiment.
// try out range syntax in media queries: https://www.bram.us/2021/10/26/media-queries-level-4-media-query-range-contexts/

// NICE TO HAVE / ENHANCEMENTS
// add gradient to give background some dimension. Like a back wall and floor corner effect. FOR EXAMPLE:
// background: linear-gradient(0deg, #fedd37 39%, var(--theme-color-body-bg)40%);
// background-size: 100% 100%;
// background-position: center bottom;
// card flip animation
// add some gristly texture overlay to "for kids"... background clip image with a multiply? use a data attribute for the text to mimic text before and/or after. Maybe can get drop shadow effect this way and do a blend mode?
// for progress bar, try using a mask to reveal the svg beneath. Make the progress a squiggle, something fun, better than a bar. Think 80's/90's swooping sketch squiggle
// update cubic bezier easing... add some smoothing, maybe some bounce
// Make the progress bar fill up the entire viewport edge? completes the full square??? https://stackoverflow.com/questions/31996110/progress-bar-along-the-borders-of-a-rectangle#32003052
// Add full screen background imagery per theme.
// update select arrow with chevron?
// on full completion, maybe rainbow animate the color bar?
// make slider more interesting. add ::after to change shape, or add encouraging messaging
// have an input mode, where checks the answer and if correct, apply the selected class, if not, shake no
// add a progress monitor tool so users can see what day they did and how much they got right.
// try to get grid to load only when applicable and not all at the beginning to avoid the FOUC. Lazy load???
// ADD a shuffle/reset button to refilter
// add a start stop timer?
// add alerts like "half way there! Keep going!", "only 10 more!"
// final slide is a "complete!" message with an animation? or the card is a "success" card?
// celebrate once reach the end... hooray! confetti?

//NOTES:
// Who was this made for? KIDS! Specifically elementary school age that supporting accessibility features like dyslexic readers
// design suggests: daring, brave, adventure, curiosity, confidence, encouragement, focus, fun, positive, excitement, nostalgia? Needs to be legible for clarity and speed but also have a sense of curiosity, encouragement and fun. It also needs work with each theme that is selected.
// DYSLEXIA FEATURES to note:
// add theme for dyslexia... use a different font, allow for color, size modifications? Perhaps just apply a data-theme for dyslexia!
//left align everything
//use dark grey for text... true black on white bgcolor can create a blurring effect
// use visual alerts
// reinforced text with icons

/**
 * This project incorporates the following:
 * Designed layout, typography, color systems
 * SCSS includes, use, prepped for css modules
 * SCSS design system, css custom properties, mixins, functions
 * SASS for loop
 * CSS animation
 * Creation of custom React components and integration of third party component
 * Custom accessibility theming
 * Accessibility enhancements, specifically for keyboard users, dyslexia and prefers-reduced-motion
 * React state management, derived state, lifting state, child to parent communication.
 * Translating JS data into CSS variables for style manipulation.
 * User research - dyslexia design theory and mathematics
 * User testing - dyslexic user, prefer colors, fonts, icons(1x1 spacing vs spread out), layout
 * Fluid typography using container queries techniques
 */

/**
 * PROBLEM SOLVING
 * Started with a grid. Not ideal for dyslexia because there is so much competing information. Decided to show one at a time with a carousel to help focus on 1 problem at a time and reducing distraction.
 * Typography. Unkempt vs Bangers... Unkempt too much like the "For Dummies" books from the 90's.
 * Color theming. Utilized native html emoji colors to create well balanced, well contrasted and easy to read color themes.
 * Token variable naming conventions... attempted to map the raw color names to a --theme-accent-primary/1/2/3 but found that confusing and unnecessary for this particular project. In a more advanced system naming primary/secondary/accents would be more appropriate.
 * Made buttons large so children who are using a mouse and touch screen can interact easier.
 * Make progress bar span as much space as possible to make progress more noticeable with so many cards. Noticing progress is more encouraging than barely making a dent.
 * Accessibility. Tabbing. I had options to utilize arrows as tabbable navigation, however, since each slide item is a focusable element itself, then the user can automatically tab forward and backward through the slides. Incorporating the arrow buttons would be difficult because the user would have to tab into the specific card shown, then tab back to the arrows in order to continue navigating. I decided to keep it simple and not over-complicate the solution.
 * I ran into issues with the dyslexia icons on mobile. I experimented with many options to reduce the choppiness on mobile safari.
 */

/**
 * Dyslexia features to note:
 * site resources... note a few things like visuals, left align, colors, fonts, etc.
 * https://uxplanet.org/designing-for-dyslexia-6d12e8c41cd7
 * https://www.prologic-technologies.com/blog/how-to-design-for-users-with-dyslexia
 * https://mathsnoproblem.com/blog/learner-focus/supporting-dyslexia-maths-classroom#:~:text=Give%20visual%20support%20for%20the,(e.g.%20tri%20%3D%203).
 * https://homeschoolingwithdyslexia.com/dyslexia-mastering-math/
 *
 */

/**
 * Other Resources:
 * https://www.embla-carousel.com/
 * Container Query Units and Fluid Typography by Stephanie Eckles - https://moderncss.dev/container-query-units-and-fluid-typography/
 */

const App = () => {
  const [dataAccessibilityTheme, setDataAccessibilityTheme] = useState("");
  const [dataTheme, setDataTheme] = useState("🤖");
  const documentBodyRef = useRef();

  useEffect(() => {
    documentBodyRef.current.setAttribute(
      "data-accessibility-theme",
      dataAccessibilityTheme
    );

    return () => {
      documentBodyRef.current.removeAttribute("data-accessibility-theme");
    };
  }, [dataAccessibilityTheme]);

  useEffect(() => {
    documentBodyRef.current.setAttribute("data-theme", dataTheme);

    return () => {
      documentBodyRef.current.removeAttribute("data-theme");
    };
  }, [dataTheme]);

  const handleAccessibilityTheme = () => {
    setDataAccessibilityTheme(
      dataAccessibilityTheme !== "dyslexic" ? "dyslexic" : ""
    );
  };

  return (
    <div className="app" ref={documentBodyRef}>
      <div className="wrapper">
        <div className="controls">
          <Switch
            label="Optimize for Dyslexia"
            onChange={() => handleAccessibilityTheme()}
          />
          <div className="iconSelect">
            <label htmlFor="icon-select">Theme</label>
            <select
              id="icon-select"
              name="icon"
              value={dataTheme}
              onChange={(e) => setDataTheme(e.target.value)}
            >
              <option value="🚀">🚀</option>
              <option value="🤖">🤖</option>
              {/* <option value="🦊">🦊</option> */}
              {/* <option value="🌴">🌴</option> */}
              {/* <option value="💜">💜</option> */}
              {/* <option value="🍔">🍔</option> */}
              {/* <option value="💩">💩</option> */}
            </select>
          </div>
        </div>
        <div className="leftSide">
          <header>
            <h1>
              Multiplication Flashcards
              <br />
              <span>for kids!</span>
            </h1>
            <h2>An accessible way to practice multiplication problems.</h2>
          </header>
        </div>
        <div className="rightSide">
          <CardCarousel icon={dataTheme} />
        </div>
        <footer>
          &copy;&nbsp;2024&nbsp;Ryan&nbsp;Brandle.{" "}
          <em>Crafted&nbsp;with&nbsp;care&nbsp;for&nbsp;curious&nbsp;minds!</em>
        </footer>
      </div>
    </div>
  );
};
export default App;
