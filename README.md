# BreatheWell

A responsive, bilingual (Bangla/English) breathing exercise website built with HTML, CSS, Bootstrap 5 and vanilla JavaScript.

## Run
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Internet access is required for Bootstrap, Bootstrap Icons and Google Fonts CDN assets.

## Included
- Dedicated individual pages:
  - `index.html`: Home page with hero, featured exercise overview, breath test teaser, and medical/safety hub.
  - `exercises.html`: Breathing exercises library, difficulty level selector, interactive guided breathing session, and completion celebration.
  - `breath-test.html` (and `test.html`): Interactive respiratory assessments including BOLT (Body Oxygen Level Test) and BPM breathing rate counter, science insights, and local test history.
- Seamless navigation between pages on desktop and mobile bottom drawer.
- Deep linking support (e.g. `exercises.html?exercise=box&action=start`).
- Bangla default language; language preference is stored in localStorage.
- Four breathing practices with 3 progressive difficulty levels each.
- Session duration selector (3, 5, 10 minutes).
- Synchronized phase animation and elapsed-time-based session timer.
- Start, pause, resume and stop controls.
- Optional browser speech synthesis audio.
- Safety guidance and disclaimer.
- Responsive layouts and reduced-motion support.

## Notes
- This is a general wellness tool, not a medical device or treatment.
- The browser's speech synthesis availability and Bangla voice quality vary by device.
- Box breathing includes gentle optional holds. Users should stop or skip any uncomfortable phase.
- The natural mindful breathing exercise intentionally does not impose a breathing rate.
