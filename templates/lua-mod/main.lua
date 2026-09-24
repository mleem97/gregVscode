-- __MOD_ID__: __DESCRIPTION__
-- Deploy: UserData/gregCore/Mods/Lua/__MOD_ID__/ (main.lua + mod.json)

function on_init()
    greg.ui.log_info("[__MOD_ID__] loaded (money=" .. greg.player.money() .. ").")
    greg.on("greg.PLAYER.CoinChanged", function(payload)
        greg.ui.log_info("[__MOD_ID__] coins changed.")
    end)
end

function on_update(dt)
end

function on_shutdown()
end
