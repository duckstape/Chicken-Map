package de.arthurkoch.ChickenMap2;

import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

public class ChickenMap2 extends JavaPlugin implements Listener {

    @Override
    public void onEnable() {
        //sets up a Scheduler, so the chicken positions are getting updated every 20 ticks = 1 sec
        this.getServer().getScheduler().scheduleSyncRepeatingTask(this, new ScanChickens(), 0, 20);
    }
}
