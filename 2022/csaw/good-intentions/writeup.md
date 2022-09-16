`2022` `csaw` `web`

# Good Intentions
`flag{Th3_roAd_t0_pwn_is_paVed_With_g00d_int3ntions}`

_tl;dr_

RCE in python's `logging.config` module by arbitrary file upload and path traversal.

___

Found the following attack surfaces:

- arbitrary file upload via the `upload` route
- loading of arbitrary config files by path traversal via the `log_config` route
- from the [Configuration file format](https://docs.python.org/3/library/logging.config.html#logging-config-fileformat) section in the python documentation for the `logging.config` module:

  > Sections which specify handler configuration are exemplified by the following.
  >
  > ```
  > [handler_hand01]
  > class=StreamHandler
  > level=NOTSET
  > formatter=form01
  > args=(sys.stdout,)
  > ```
  > The class entry indicates the handler’s class **(as determined by eval() in the logging package’s namespace)**.

Putting everything together, I

1. crafted a malicious config file containing python instructions to expose the flag when eval()-uated within the `class` entry.
2. uploaded the file via the `upload` route.
3. determined the (in parts randomly created) file path name via the `gallery`route.
4. loaded the malicious configuration file via the `log_config` route using a relative path traversal to the uploaded file.

see [exploit](./exploit.sh) for an automation of the attack.
