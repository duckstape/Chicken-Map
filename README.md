_before doing something please read the whole README to prevent wasting time cause some things need to be done before others_

# Chicken-Map
A Bukkit-Plugin for displaying how many chickens you got at which place. This will be shown with an webapp in the style of a Heatmap.

![gui](https://kevinko.ch/ChickenHeatMapGui.png "chickenmap gui")
## How to build the plugin (guide for big brains)
1. download the [nms](https://cdn.getbukkit.org/spigot/spigot-1.16.5.jar) jar and place it into `/plugin source code/src/main/resources/`
2. package it trough maven with `/plugin source code/pom.xml`


## How to build the plugin with Intellij (guide for small brains like me)
1. download the Sourcecode via Code > Download ZIP
2. unzip and open it with Intellij
3. download the [nms](https://cdn.getbukkit.org/spigot/spigot-1.16.5.jar) jar and copy it to `/plugin source code/src/main/resources/`
4. rightclick `/plugin source code/pom.xml` > Add as Maven Project
5. on the far right open the maven tab and inside of the tab go to `ChickenMap2/Lifecycle` and doubleclick `package`
6. copy `/plugin source code/target/ChickenMap2-1.0-SNAPSHOT.jar` to the plugin folder of your Bukkit Server


## What about the GUI?
**Requirements:**
- you need a Webserver like Apache or NGINX up and running on the same machine as the Bukkit Server is running ([tutorial for installing apache on linux](https://www.linuxshelltips.com/install-apache-in-linux/))
- the Bukkit Server needs to be running on Minecraft version 1.16.5
- everything inside the `Files for Serving on the Webserver` folder needs to be accessible through the Webserver (just like the index.html file from the tutorial)

**What you should change in the code:**
- `src/main/java/de/arthurkoch/ChickenMap2/ScanChickens.java`: change `dataDiscLocation` in line 34 to the directory where you put the content of the `Files for Serving on the Webserver` folder
- `Files for Serving on the Webserver/script.js`: change the first three lines. Set the ingame coordinates to where the map should open when the website loads, with `mcBasePosX` and `mcBasePosZ`. With `initalZoomFac` change how far the map should be zoomed in when the website is loaded (1 = one pixel is one block, 10 = ten pixels are one block)

## Thats it!
Now reload the plugins in the bukkit Server and open the `index.html`. You should see your base and all the chicken updating every 1 Sec.

## Only version 1.16.5? But I need another one...
That is a bit unfortunate but if you know enough about plugin dev you can do that yourself! I left hopefully enough comments in the code, for figuering that out. If you implement them and you do a pull request I'll accept it and bing bang boom another one can use this plugin, who couldn't before. That would be sooooo cool! Like a real mini open source project!


Alright that's everything, i hope you have fun with it!
All the best,
duckstape :)
