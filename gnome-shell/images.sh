#! /bin/bash

cd gnome-shell/src/assets;
convert panelActivities.png -fill '<<colors.C08.css()>>' -colorize 100% panelActivities-hover.png;