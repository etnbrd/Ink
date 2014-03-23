![Ink](logo.png)



A gnome-shell 3.10 theme simply written, in Less.

---

Two things about gnome-shell theming :

+ It's amazing to use CSS to render themes.
+ gnome-shell themes are usually a mess, because one big file is hard to read and maintain.

Less might help us avoid mess.

---

Original idea :
http://worldofgnome.org/create-a-gnome-shell-theme-with-less-stylesheets/

---

This is a work in progress, but you can already use it, and issue bug reports.

## Screens

![Screenshot calendar](https://raw.github.com/etnbrd/Ink/master/screens/screen-calendar.png)
![Screenshot system menu](https://raw.github.com/etnbrd/Ink/master/screens/screen-sys.png)


## Installation

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