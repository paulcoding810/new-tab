[![Badge Commits]][Commit Rate]
[![Badge Issues]][Issues]
[![Badge License]][License]
[![Badge Mozilla]][Mozilla]
[![Badge Chrome]][Chrome]

---

<h1 align="center">
<sub>
<img src="public/img/logo-48.png" height="38" width="38">
</sub>
New Tab
</h1>

---

<p align="center">
<a href="https://addons.mozilla.org/addon/new-tab-paulcoding/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get New Tab for Firefox"></a>
<a href="https://chromewebstore.google.com/detail/new-tab/jiibpofabngjenalkdgpkhgifmoabnij"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get New Tab for Chromium"></a>
</p>

***

NewTab Extension lets you personalize your browser’s new tab page by fetching and displaying high-quality images or videos from external sources.

***

## 🚀 Features

![New tab](https://github.com/user-attachments/assets/8d6746e8-7332-4556-b4b4-2163af41151e)

![Settings](https://github.com/user-attachments/assets/a4e3ddd4-4bc3-49f8-a586-0e384c30875d)

## 💻 Development

### Hot Module Replacement (HMR)

Only apply for Chrome

```bash
# Start development server
yarn dev
```

### Building

```bash
yarn build # for Chrome extension
yarn build:firefox # for Firefox add-on
```

### Packing

To create a zip file for distribution, run:

```bash
yarn zip # for chrome
yarn zip:firefox # for firefox
```

### Loading in Chrome

1. Enable Developer mode
2. Click "Load unpacked"
3. Select the `build` folder

### Loading in Firefox

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `build` folder

---

## Credits

- [unsplash](https://unsplash.com/photos/a-cat-wearing-a-sunflower-costume-on-its-head-cQAoMJ2utDA) for the default background image
- [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext) for the boilerplate code and useful scripts to start a new project.

<!----------------------------------[ Badges ]--------------------------------->

[Mozilla]: https://addons.mozilla.org/addon/new-tab-paulcoding/
[Chrome]: https://chromewebstore.google.com/detail/new-tab/jiibpofabngjenalkdgpkhgifmoabnij
[License]: https://raw.githubusercontent.com/paulcoding810/new-tab/refs/heads/main/LICENSE

[Commit Rate]: https://github.com/paulcoding810/new-tab/commits/main
[Issues]: https://github.com/paulcoding810/new-tab/issues

[Badge Commits]: https://img.shields.io/github/commit-activity/m/paulcoding810/new-tab?label=Commits
[Badge Mozilla]: https://img.shields.io/amo/v/new-tab-paulcoding
[Badge Chrome]: https://img.shields.io/chrome-web-store/v/jiibpofabngjenalkdgpkhgifmoabnij
[Badge License]: https://img.shields.io/badge/License-MIT-yellow.svg
[Badge Issues]: https://img.shields.io/github/issues/paulcoding810/new-tab/issues
