# Notice — photographs and icons

The MIT license in [LICENSE](LICENSE) covers this project's source code. It does
**not** cover the photographs in `src/static/imgs/`, nor the icons' shapes
([Icons](#icons), below).

Files there whose names begin with `pexels-` are photographs from
[Pexels](https://www.pexels.com). They are provided under the
[Pexels License](https://www.pexels.com/license/) and the
[Pexels Terms of Service](https://www.pexels.com/terms-of-service/), and remain
the work of their photographers. They are included as **placeholders** so the
template renders with real imagery.

## If you keep the photos

You are responsible for following the Pexels License yourself. In short:

- Do not sell or redistribute the photos on their own, or on another stock-photo
  or wallpaper service.
- Do not show identifiable people in a bad light, or imply that a person or
  brand in a photo endorses your product. Do not present a pictured person as
  someone they are not.
- Do not use a photo as part of a trademark, logo, or business name.
- Check photos that show logos, brands, or recognisable people before using them
  commercially; Pexels does not guarantee that releases were obtained.

Read the full terms at the links above — this summary is not legal advice and
the Pexels terms can change.

## If you replace the photos

Swap in your own images, then remove the `photoCredit` entry from
`src/static/data/app.model.json`. The footer credit ("Photos provided by
Pexels") is rendered from that entry and disappears with it.

## Credits

Applications generated with `spyne-cli create-app --prompt` also ship an
`image-manifest.json` at the project root, listing the photographer and Pexels
source page for every generated image.

Sample photographs shipped with this template:

| File | Photographer | Source |
| --- | --- | --- |
| `pexels-gosia-k-23254118-35356461.jpg` | Gosia K | https://www.pexels.com/photo/dramatic-silhouette-of-trees-against-a-cloudy-sky-35356461/ |
| `pexels-krivec-ales-580151.jpg` | Krivec Ales | https://www.pexels.com/photo/mountainous-valley-with-evergreen-forest-against-misty-sky-580151/ |
| `pexels-photo-1000445.jpeg` | Belle Co | https://www.pexels.com/photo/silhouette-photography-of-group-of-people-jumping-during-golden-time-1000445/ |
| `pexels-photo-1169754.jpeg` | Philippe Donn | https://www.pexels.com/photo/milky-way-illustration-1169754/ |
| `pexels-photo-1292115.jpeg` | eberhard grossgasteiger | https://www.pexels.com/photo/aerial-photography-of-pine-trees-1292115/ |
| `pexels-photo-2256041.jpeg` | not recorded | Pexels photo 2256041 (source page no longer available) |
| `pexels-photo-3184418.jpeg` | fauxels | https://www.pexels.com/photo/photo-of-people-near-wooden-table-3184418/ |
| `pexels-photo-3591557.jpeg` | Tomáš Malík | https://www.pexels.com/photo/close-up-photo-of-geological-formation-3591557/ |

## Icons

The shapes in `src/app/traits/utils/icon-shapes.js` are Google's
[Material Symbols](https://fonts.google.com/icons), copyright Google LLC, under the
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Each is taken
unchanged from the SVG of its name in
[`google/material-design-icons`](https://github.com/google/material-design-icons) at
commit `10ecc14`. The shapes are compiled into the application's script.
