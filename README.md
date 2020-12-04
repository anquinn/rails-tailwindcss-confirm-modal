# rails-tailwindcss-confirm-modal
A drop in replacement for the Rails data-confirm dialog using Tailwind CSS. Exposes some additional options.

Your app must be using Tailwind CSS.

## Options
`data-confirm` The title for the modal. Required.

`data-body` Secondary text for the modal. "This action cannot be undone" by default. Optional.

`data-commit` The 'confirm' button text. "Confirm" by default. Optional.

`data-cancel` The 'cancel' button text. "Cancel" by default. Optional.

`data-color` The tailwind color to base the modal off of. You may have to safelist the background and text color with purgecss.

## Usage
Import `rails-tailwindcss-confirm-modal.js` to your rails app.

```ruby
<%= link_to "Model", @model, method: :delete, data: { confirm: "Are you sure you want to delete this model?", body: "This action cannot be undone.", commit: "Delete", cancel: "Cancel", color: "red"} %>
```
