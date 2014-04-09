![Ink](logo.png)

A dark, flat, minimalist theme for great tools.
And customizable to suit your needs.

This is a work in progress, but you can already use it, and issue bug reports.

Include :

+ gnome-shell 3.10.4
+ mutter (metacity 1 & 2)
+ gtk 3
+ sublime-text 3
+ firefox
+ shell
+ markdown

## Screens

![Screenshot calendar](https://raw.github.com/etnbrd/Ink/master/screens/screen-calendar.png)
![Screenshot system menu](https://raw.github.com/etnbrd/Ink/master/screens/screen-sys.png)

## Dependencies

+ npm
+ node
+ imagemagick

## 1. Modify

The colors and the themes to build are in the file `Ink.yml`
Each teheme is a directory containing a `build.yml` file, one or more template files and a `src` directory.
This `src` directory should contain the final theme to be installed.
The template files might contain some refrence to the colors in Ink.yml, like this : `<<colors.C00.css()>>`.

## 2. Build & Install

`npm install`
`sudo id && node build.js`
For the moment, we need sudo privileges without entering the password.
See build.js:80

## TODOS

+ Fix the sudo shit (build.js:80)
+ To reload images in gnome-shell, need to do a Alt+F2 > rt
