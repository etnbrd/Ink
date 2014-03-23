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

## 1. Modify

Open `Ink.yaml`.
Modify the color scheme, and the installation path

## 2. Build

`grunt build`

## 3. Install

`grunt install`


---

## dev notes

If you install this theme locally, you won't be able to change the login window and the screen-shield, but if something goes wrong, you're safely backed-up by the default theme.
If you install this theme for your whole system, you might have to enter some command on one of your tty to get the defualt theme back.

#### Local (safe)
```
git clone https://github.com/etnbrd/Ink.git
cp -r Ink ~/.local/share/theme 
```

#### Global (riskier)
```
git clone https://github.com/etnbrd/Ink.git
sudo mv /usr/share/gnome-shell/theme /usr/share/gnome-shell/theme.old
cp -r Ink /usr/share/gnome-shell/theme
```

## Compilation

### gnome-shell

To compile and reload the theme from command line :

```
lessc gnome-shell.less gnome-shell.css && gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval 'Main.loadTheme();'
```

### sublime-text

```
node make.js && cd Ink && zip -r ../Ink.sublime-package * && cd ..
```