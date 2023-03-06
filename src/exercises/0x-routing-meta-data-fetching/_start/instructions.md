# Title

Let's build a generic Data Fetching mechanism by using a navigation guard. Using `meta` fields, we can add anything we want and then consume it inside of a navigation guard.

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Use `~/api/memes`'s `getMemes()` function to fetch a list of memes
- Display the memes using the provided masonry layout
- Implement the data fetching inside of a navigation guard inside `navigation-guard.ts`
- Generalize the mechanism to **any** API call

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Extend TypeScript interfaces to make everything type safe without any usage of `any`
- Allow each _meme_ to be clickable and scrollable
- Make scrolling work when going back or forward. You can test this by clicking on a few different memes and then going _back_ or _forward_ with the Browser UI arrows. Note you will need to change `src/router.ts`.
