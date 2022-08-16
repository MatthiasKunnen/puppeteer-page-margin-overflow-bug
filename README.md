# Reproduction for overflow when first page in PDF has different y-margin from other pages
When the first page of the pdf has a different `margin-top`/`margin-bottom` (using `@page :first {margin-top: x}`) the page break points of the rest of the pages is incorrect. This causes either overflow or the content breaking too soon.

## Related issues
Puppeteer: <https://github.com/puppeteer/puppeteer/issues/8782>  
Chromium: <https://crbug.com/1353222>  

## Test it yourself
Run `yarn run start` to generate `out.pdf` once.  
Run `yarn run watch` to generate `out.pdf` every time the source `index.html` changes.  


## My understanding of the issue
The inner height (content height of the page, height without margin) of the first page seems to determine the inner height of the other pages.

Example; given a document that is 20 cm in length, a first page margin-top of 0 cm, and rest of page margin of 2 cm. The inner height of the first page is 20 cm (20 cm page height - 0 cm margin). For the second page, the content starts 2 cm from the start of the page but keeps going for 20 cm instead of 18 cm. This causes overflow.

Example; given a document that is 20 cm in length, a first page margin-top of 2 cm, and rest of page margin of 0 cm. The inner height of the first page is 18 cm (20 cm page height - 2 cm margin). For the second page, the content starts 0 cm from the start of the page but keeps going for only 18 cm instead of 20 cm. This causes an early break.

The same problem occurs with margin-bottom.

## Examples of margin-top differences

| first page margin-top | other pages margin-top | PDF                                                                               | result                                                      |
|----------------------:|-----------------------:|:----------------------------------------------------------------------------------|-------------------------------------------------------------|
|                     0 |                   2 cm | [first-page-smaller-margin-top.pdf](./examples/first-page-smaller-margin-top.pdf) | All but the first page break 2 cm too late causing overflow |
|                  2 cm |                      0 | [first-page-larger-margin-top.pdf](./examples/first-page-larger-margin-top.pdf)   | All but the first page break 2 cm too early                 |
|                  2 cm |                   2 cm | [equal-margin.pdf](./examples/equal-margin.pdf)                                   | All margins and breaks are correct                          |
