#! /bin/sh

sudo mv /usr/share/gnome-shell/theme /usr/share/gnome-shell/theme.old

sudo ln -s ~/Projects/Ink					 	/usr/share/theme/Ink
sudo ln -s ~/Projects/Ink/gnome-shell			/usr/share/gnome-shell/theme
sudo ln -s ~/Projects/Ink/Ink.sublime-package 	~/.config/sublime-text-3/Installed\ Packages/