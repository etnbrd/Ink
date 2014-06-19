<!-- ![Ink](logo.png) -->

<div id="container" style="text-align: center">
    <img src="logo.png" alt="Ink"/>
</div>

---

**A dark, flat, minimalist theme for great tools.  
Designed with fast and easy customization in mind.**

---

This is a work in progress.
Use it at your convenience, and please flood me with bug reports :)
See below for customization and installation instructions.

**Includes** :

stable :

+ gnome-shell 3.12+
+ metacity 3 (credit to [xyl0n](https://github.com/xyl0n/iris))
+ gtk 2 & 3 (credit to [xyl0n](https://github.com/xyl0n/iris))
+ shell (needs manual config, see `oh-my-zsh/build.yml`)

soon :

+ sublime-text 3

in my dreams :

+ firefox
+ markdown

in my wildest dreams :

+ empathy
+ and so much more ...

## Screens

![Screenshot calendar](https://raw.github.com/etnbrd/Ink/master/screens/screen-calendar.png)
![Screenshot system menu](https://raw.github.com/etnbrd/Ink/master/screens/screen-sys.png)

## Dependencies

+ node
+ imagemagick

# Customization and Installation

This project is more than a set of themes.
It's a tool to automatically build multiple themes with a matching set of colors.

1. modify the color scheme as you wish
2. backup everything *(this theme replaces the default gnome-shell theme)*
3. `node build`
4. enjoy :)

## 1. Modify

### ligth modifications
The colors and the themes to build are in the file `Ink.yml` in the root folder  
An easy way to get a preview is to only build `colors` with `colors/src/index.html` open in your browser.  
Modify, reload, appreciate, loop. 

### Hardcore modifications
Each theme is a directory containing a `build.yml` file describing everything the engine needs to build, one or more template files and a `src` directory.  




#### Example of a `build.yml` : gnome-shell.

```
template:
  - 'gnome-shell.less'
  - 'images.sh'

```
The template engine modify these files from the theme root directory, and places them inside the `src` directory.  
The `src` directory should contain the final theme to be installed.  
The template files contain some refrence to the colors in `Ink.yml`, like this : `<<colors.C00.css()>>`.  
The template engine take the string inside the `<<>>`, execute it and place the result.

```
less:
  'gnome-shell.less'
```
Compile the file with less.

```
run:
  'images.sh'
```
This script uses imagemagick to modify bitmap image from white to the specified color.

```
install:
  src: 
    - 'gnome-shell.css'
    - 'assets'
  dest:
    '/usr/share/gnome-shell/theme'
```
The engine copy files and folders specified as `src` from the `src` folder and place it inside `dest`.

```
load:
  "gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval 'Main.loadTheme();'"
```
A command to refresh and enjoy immediatly the theme.

## 2. Backup

**BACKUP, DO IT !**  
The gnome-shell theme will be completly erased.
If this theme doesn't work, better be preperad :
```
cd /usr/share/gnome-shell/theme
cp -r theme theme.bkp
```

## 3. Build & Install

`npm install`  
`sudo id && node build.js`  
For the moment, we need sudo privileges to install the theme, but the password prompt fails.  
See build.js:80

## TODOS

+ Fix the sudo shit (build.js:80)
+ To reload images in gnome-shell, need to do a Alt+F2 > rt

This is a wide work in progress.  
I try to document as much as I can, but oftenly fail.  
Here are some comment, mainly for the gnome-shell theme :

+ If there is a TODO, it needs review, and maybe modifications.
+ If there is some hardcoded colors, it needs review.
+ If something is commented, it might help you understand how I got to this solution.
+ Some UI elements designs are just plain wrong css hacks because I don't want to modify the js from gnome-shell.
+ Don't hesitate to send me complete refactoring pull requests, bug fixes, patches, or simply issues you notice.  
I will do my best to work it out.

Thanks :)





