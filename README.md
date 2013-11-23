# Ink

A gnome-shell 3.10 theme simply written, in Less.

---

Two things about gnome-shell theming :

+ It's amazing to have used CSS to render themes.
+ gnome-shell themes are usually a mess because of this big css file.

Less might help us avoid mess.

---

Original idea :
http://worldofgnome.org/create-a-gnome-shell-theme-with-less-stylesheets/

---

This is a work in progress, but you can already use it, and issue bug reports.

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