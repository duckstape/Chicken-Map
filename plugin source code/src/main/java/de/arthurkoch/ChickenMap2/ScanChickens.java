package de.arthurkoch.ChickenMap2;

import com.google.gson.Gson;
import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.entity.Chicken;
import org.bukkit.entity.Entity;
import org.bukkit.block.Block;
import org.bukkit.craftbukkit.v1_16_R3.util.CraftMagicNumbers;
import org.bukkit.entity.Player;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;

/*---------------------------

GLOSSARY:

ChickenBlock - Represents a block in mc where one or more chicken are on top.
map          - The picture that this plugin renders. It only contains the colors of the blocks, not any infos about
               chickens and serves as a background for the GUI

----------------------------- */

//generates a json with the position of all chickens, players and extra data and generates a png of the map
public class ScanChickens implements Runnable{
    static final String dataDiscLocation = "C:\\Users\\kevin\\Documents\\.Meine Dokumente\\Website Dev\\chickenMap\\";   //put in the directory for where the json and image file should be saved, so the webserver has access to it
    private Bound lastBounds = new Bound(0, 0, 0, 0);

    @Override
    public void run() {
        World w = Bukkit.getWorlds().get(0);
        ServerData data = new ServerData();

        for(Entity e : w.getEntitiesByClass(Chicken.class)) {
            Location loc = e.getLocation();
            data.addChickenAt(loc.getBlockX(), loc.getBlockZ());
        }

        data.updatePlayers();

        //if all chicken are inside the bounds of the current map, if not a new map will be rendered
        if(!data.bounds.equals(lastBounds)){
            data.makeBlocks();
            lastBounds = data.bounds;
        }

        try {
            Writer writer = new FileWriter(dataDiscLocation + "/chickens.json");
            new Gson().toJson(data, writer);
            writer.close();
        }catch(IOException e){
            System.out.println("Couldn't sava json");
        }

    }
}

class ChickenBlock{
    public int x;
    public int z;

    public int getChickens() {
        return chickens;
    }

    private int chickens;

    public ChickenBlock(int x, int z){
        this.x = x;
        this.z = z;
        chickens = 1;
    }

    public void addChicken(){
        chickens ++;
    }
}

//packs every needed data into this class for being later converted to the json file
class ServerData{
    private ArrayList<ChickenBlock> chickens = new ArrayList<>();
    public Bound bounds = new Bound(0, 0, 0, 0);
    private int highestChickenCount = 1;
    public ArrayList<jPlayer> players;

    public void addChickenAt(int x, int z){
        //first checks if the ChickenBlock already exist
        for (ChickenBlock chicken: chickens){
            if (chicken.x == x && chicken.z == z){
                chicken.addChicken();
                if (chicken.getChickens() > highestChickenCount){
                    highestChickenCount = chicken.getChickens();
                }
                return;
            }
        }

        //if not adds new
        ChickenBlock block = new ChickenBlock(x, z);
        chickens.add(block);
        bounds.update(block, 5);
    }

    //this renders a new map
    public void makeBlocks(){
        BufferedImage img = new BufferedImage(bounds.xMax - bounds.xMin + 1, bounds.zMax - bounds.zMin + 1, BufferedImage.TYPE_INT_RGB);

        for (int z = bounds.zMin; z <= bounds.zMax; z++) {
            for(int x = bounds.xMin; x <= bounds.xMax; x++){
                World w = Bukkit.getWorlds().get(0);

                Block b = w.getHighestBlockAt(x, z);
                net.minecraft.server.v1_16_R3.Block nmsBlock = CraftMagicNumbers.getBlock(b.getType()); //if you want to use any other mc version than 1.16.5, change this line and
                Color c = new Color(nmsBlock.s().rgb);                                                  //"nmsBlock.s()" and use the appropriate NMS version. For examples look at https://github.com/SydMontague/ServerMinimap/tree/master/modules > select the right version > /src/.../nmscompat/v*.**.*/NMSHandler.java
                img.setRGB(x-bounds.xMin, z-bounds.zMin, c.getRGB());
            }
        }

       File outputFile = new File(ScanChickens.dataDiscLocation + "/map.png");
        try {
            ImageIO.write(img, "png", outputFile);
        }catch (IOException e){
            System.out.println("Saving Img didn't work");
        }
    }

    //records all locations of the online players
    public void updatePlayers(){
        players = new ArrayList<>();

        for(Player p : Bukkit.getServer().getOnlinePlayers()) {
            Location loc = p.getLocation();
            players.add(new jPlayer(p.getDisplayName(), loc.getBlockX(), loc.getBlockZ()));
        }
    }
}

//the ingame positions of the four corners of the map
class Bound{
    public int xMin;
    public int xMax;
    public int zMin;
    public int zMax;

    public Bound(int xMin, int xMax, int zMin, int zMax) {
        this.xMin = xMin;
        this.xMax = xMax;
        this.zMin = zMin;
        this.zMax = zMax;
    }

    public void update(ChickenBlock chicken, int margin){
        if(chicken.x - margin < xMin){
            xMin = chicken.x - margin;
        }else if(chicken.x + margin > xMax){
            xMax = chicken.x + margin;
        }

        if(chicken.z - margin < zMin){
            zMin = chicken.z - margin;
        }else if(chicken.z + margin > zMax){
            zMax = chicken.z + margin;
        }
    }

    public boolean equals(Bound other){
        return xMin == other.xMin && xMax == other.xMax && zMin == other.zMin && zMax == other.zMax;
    }
}

//online player class, only exist for generating the json
class jPlayer{
    public String name;
    public int x;
    public int z;

    public jPlayer(String name, int x, int z) {
        this.name = name;
        this.x = x;
        this.z = z;
    }
}