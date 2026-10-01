# Wanderly — Travel Recommendation Website

A JavaScript travel recommendation site. Choose what you enjoy — beaches, temples,
wildlife, cities — and the site suggests destinations and shows what they look like.

**Live site:** https://marknwilliam.github.io/wanderly/

## Pages

| Page | File | Contents |
|---|---|---|
| Home | `index.html` | Introduction, preference finder, search, beach recommendations, temple recommendations, country selector |
| About Us | `about.html` | Who we are, what we recommend on, how the site works, technologies used |
| Contact Us | `contact.html` | Validated email form, other ways to reach us |

## JavaScript features (`js/main.js`)

1. **Navigation** — highlights the current page, mobile hamburger menu that closes on selection, and a search bar with **Search** and **Clear** buttons that filter the destination cards.
2. **Preference finder** — four preference buttons; non-matching cards dim and a written recommendation panel updates.
3. **Expand / collapse** — every "Read more" button reveals extra detail in place.
4. **Country selector** — six countries, each returning two destinations with images, rendered without a page reload.
5. **Form validation** — name, email, subject and message are checked before submit; errors appear per field and only after the field has been left once.

## Tech

Plain HTML5, CSS3 and JavaScript. No framework, no build step, no dependencies.

All 16 images are original SVG vector illustrations drawn for this project, so the
site renders identically offline and no image can fail to load.

## Layout

```
index.html   about.html   contact.html
css/styles.css
js/main.js
images/   16 SVG illustrations
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```
