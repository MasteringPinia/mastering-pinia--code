# Tab System with inject/provide

Some components are always meant to be used together, we call these coupled components. Very often they also need a mechanism to communicate with each other to make sure everything is in sync and they render the correct information all the time. One example of this is a Tab Manager / System: where two components, `<TabManager>` and `<TabPane>` are used together to display one single tab at a time:

```vue
<TabManager>
  <TabPane title="Overview">
    Overview of the restaurant
  </TabPane>
  <TabPane title="Menu">
    Menu of the restaurant
  </TabPane>
</TabManager>
```

Semantically, they use _slots_ to be expressive. Internally, they rely on `inject`/`provide` to keep everything in sync. Let's build them!

## 📝 Your Notes

Write your notes or questions here.

## 🎯 Goals

- Find a way to store what `TabPanes` are currently _registered_ within `TabManager`
- Each `TabPane` should allow customizing its `title` with a prop
- `TabManager` should display one button per `TabPane`
- Use the injection key inside `injectionKey.ts` for `provide`/`inject`
- Each button should display the `title` prop
- Clicking on the buttons should switch tabs
- Disable the currently selected tab's button
- Ensure the minimal information is passed from `TabManager` to `TabPane`

## 💪 Extra goals

_Extra goals might not have any tests and can be done later or skipped._

- Allow `TabManager` to accept both a v-model and no v-model
- Connect the current tab to the URL using a query
- Ensure changes to the `title` prop are reflected on the buttons
