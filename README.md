# SMADIS (WIP)
by **[PHLHG](http://phlhg.ch/)**

A small personal dashboard based on Web-Technolgies *(PHP,JavaScript,CSS)*

![Preview of SMADIS](/preview.png)

## Setup

### Server-side

First of all select a location for SMADIS on your webserver. 
The webserver should be only accessable in your local network and/or be protected by for example an HTTP-Authentication for security reasons.

```bash
cd /[your-desired-location]/
```
After selecting the location, you can clone the repository

```bash
git clone https://github.com/phlhg/smadis
```

Finally configure SMADIS by inserting your personal API-keys into:
```
/app/js/config.js
```

### Client-side
Once SMADIS is configured and runs on your webserver. You can use a raspberry pi with a monitor or any other PC to display your personal dashboard by accessing http://[your-webserver]/[your-desired-location]/ with a browser *(Chromium, Firefox, etc.)*

## Development

- [x] Separate Core and Modules
- [ ] Improve overall error logging
- [ ] Improve overall stability
- [ ] Directly edit layout of modules
    - [ ] Responsive module layouts
- [ ] Directly configure modules
- [ ] Remote control by Web-App
    - [ ] Show details
    - [ ] Privacy Mode