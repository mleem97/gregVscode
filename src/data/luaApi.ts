// Curated greg.* Lua API surface (mirrors docs/lua-api-reference.md).
// Pure data — no vscode dependency, unit-tested.

export interface LuaApiSymbol {
  /** Fully qualified name, e.g. "greg.player.money". */
  name: string;
  /** Short signature shown as detail, e.g. "money() -> number". */
  signature: string;
  /** One-line documentation. */
  doc: string;
  /** Snippet body for completion; defaults to the last name segment. */
  snippet?: string;
}

export interface LuaLifecycle {
  name: string;
  signature: string;
  doc: string;
  body: string;
}

function fn(
  name: string,
  signature: string,
  doc: string,
  snippet?: string
): LuaApiSymbol {
  return { name, signature, doc, snippet };
}

function mod(name: string, doc: string): LuaApiSymbol {
  return { name, signature: name, doc };
}

export const LIFECYCLE: LuaLifecycle[] = [
  {
    name: "on_init",
    signature: "on_init()",
    doc: "Called when the mod is loaded.",
    body: "function on_init()\n\t$0\nend",
  },
  {
    name: "on_update",
    signature: "on_update(dt)",
    doc: "Called every frame. dt is frame delta time.",
    body: "function on_update(dt)\n\t$0\nend",
  },
  {
    name: "on_scene_loaded",
    signature: "on_scene_loaded(name)",
    doc: "Called when a new scene is loaded.",
    body: "function on_scene_loaded(name)\n\t$0\nend",
  },
  {
    name: "on_shutdown",
    signature: "on_shutdown()",
    doc: "Called before mod reload or game exit.",
    body: "function on_shutdown()\n\t$0\nend",
  },
  {
    name: "on_reload",
    signature: "on_reload()",
    doc: "Called after a successful hot-reload.",
    body: "function on_reload()\n\t$0\nend",
  },
];

export const LUA_API: LuaApiSymbol[] = [
  // Timers & coroutines
  fn("greg.wait", "wait(seconds, callback)", "Calls callback once after n seconds.", "wait(${1:seconds}, function()\n\t$0\nend)"),
  fn("greg.every", "every(seconds, callback)", "Calls callback every n seconds.", "every(${1:seconds}, function()\n\t$0\nend)"),
  fn("greg.start_coroutine", "start_coroutine(func)", "Runs func as a coroutine (yield inside).", "start_coroutine(${1:func})"),

  // greg.player
  mod("greg.player", "Player state and stats."),
  fn("greg.player.position", "position() -> table", "{x, y, z} of the player."),
  fn("greg.player.money", "money() -> number", "Current player money."),
  fn("greg.player.set_money", "set_money(val)", "Sets player money."),
  fn("greg.player.add_money", "add_money(amount)", "Adds player money."),
  fn("greg.player.xp", "xp() -> number", "Current player XP."),
  fn("greg.player.set_xp", "set_xp(val)", "Sets player XP."),
  fn("greg.player.reputation", "reputation() -> number", "Current reputation."),
  fn("greg.player.set_reputation", "set_reputation(val)", "Sets reputation."),
  fn("greg.player.teleport", "teleport(x, y, z)", "Teleports the player."),
  fn("greg.player.is_crouching", "is_crouching() -> bool", "Whether the player is crouching."),
  fn("greg.player.is_sitting", "is_sitting() -> bool", "Whether the player is sitting."),

  // greg.server
  mod("greg.server", "Server devices."),
  fn("greg.server.get_all", "get_all() -> table", "Array of {id, hash, is_on, is_broken, size_u?, x, y, z}."),
  fn("greg.server.get_list", "get_list() -> table", "Array of server IDs."),
  fn("greg.server.count", "count() -> number", "Server count."),
  fn("greg.server.broken_count", "broken_count() -> number", "Broken server count."),
  fn("greg.server.find_by_id", "find_by_id(id) -> table or nil", "Finds a server by ID."),
  fn("greg.server.find_by_ip", "find_by_ip(ip) -> table or nil", "Finds a server by IP."),
  fn("greg.server.repair", "repair(id) -> bool", "Repairs a server."),
  fn("greg.server.repair_all", "repair_all() -> number", "Repairs all servers, returns count."),
  fn("greg.server.power_on", "power_on(id) -> bool", "Powers a server on."),
  fn("greg.server.power_off", "power_off(id) -> bool", "Powers a server off."),
  fn("greg.server.set_ip", "set_ip(id, ip) -> bool", "Sets a server IP."),
  fn("greg.server.set_customer", "set_customer(id, customerId) -> bool", "Assigns a customer."),
  fn("greg.server.set_app", "set_app(id, appId) -> bool", "Sets the server app."),
  fn("greg.server.clear_warning", "clear_warning(id) -> bool", "Clears the server warning."),
  fn("greg.server.has_cable", "has_cable(id) -> bool", "Whether the server has a cable."),
  fn("greg.server.valid_position", "valid_position(id) -> bool", "Whether the server position is valid."),
  fn("greg.server.capture", "capture(id) -> table or nil", "Full server snapshot."),
  fn("greg.server.insert_into_rack", "insert_into_rack(id, spec) -> bool", "Inserts into rack (spec: rack_uid, prefab, is_on, …)."),

  // greg.switch
  mod("greg.switch", "Network switches."),
  fn("greg.switch.get_all", "get_all() -> table", "Array of {id, hash, is_on, is_broken, x, y, z}."),
  fn("greg.switch.get_list", "get_list() -> table", "Array of switch IDs."),
  fn("greg.switch.count", "count() -> number", "Switch count."),
  fn("greg.switch.broken_count", "broken_count() -> number", "Broken switch count."),
  fn("greg.switch.find_by_id", "find_by_id(id) -> table or nil", "Finds a switch by ID."),
  fn("greg.switch.repair", "repair(id) -> bool", "Repairs a switch."),
  fn("greg.switch.repair_all", "repair_all() -> number", "Repairs all switches, returns count."),

  // greg.tech
  mod("greg.tech", "Technicians."),
  fn("greg.tech.free_count", "free_count() -> number", "Free technician count."),
  fn("greg.tech.total_count", "total_count() -> number", "Total technician count."),
  fn("greg.tech.dispatch_server", "dispatch_server() -> 1/0", "Sends a technician to one broken server."),
  fn("greg.tech.dispatch_switch", "dispatch_switch() -> 1/0", "Sends a technician to one broken switch."),
  fn("greg.tech.list", "list() -> table", "Array of {id, name, salary, state, busy}."),
  fn("greg.tech.send_to_server", "send_to_server(technicianId, serverId) -> bool", "Sends a technician to a server."),
  fn("greg.tech.send_to_switch", "send_to_switch(technicianId, switchId) -> bool", "Sends a technician to a switch."),
  fn("greg.tech.hire", "hire(index) -> bool", "Hires a technician."),
  fn("greg.tech.fire", "fire(technicianId) -> bool", "Fires a technician."),
  fn("greg.tech.request_next_job", "request_next_job(technicianId) -> bool", "Requests the next job."),

  // greg.rack
  mod("greg.rack", "Racks."),
  fn("greg.rack.get_all", "get_all() -> table", "All racks."),
  fn("greg.rack.count", "count() -> number", "Rack count."),
  fn("greg.rack.is_position_available", "is_position_available(rackId, position) -> bool", "Whether a rack position is free."),
  fn("greg.rack.get_used_count", "get_used_count(rackId) -> number", "Used positions in a rack."),
  fn("greg.rack.mark_used", "mark_used(rackId, position)", "Marks a rack position used."),
  fn("greg.rack.mark_free", "mark_free(rackId, position)", "Marks a rack position free."),

  // greg.cable
  mod("greg.cable", "Cable info (read-only; world edits need C#)."),
  fn("greg.cable.get_all", "get_all() -> table", "All cables."),
  fn("greg.cable.count", "count() -> number", "Cable count."),
  fn("greg.cable.get_next_id", "get_next_id() -> number", "Next cable ID."),

  // greg.patch
  mod("greg.patch", "Patch panels."),
  fn("greg.patch.get_all", "get_all() -> table", "Array of {id, hash, x, y, z}."),
  fn("greg.patch.get_list", "get_list() -> table", "Array of patch panel IDs."),
  fn("greg.patch.count", "count() -> number", "Patch panel count."),
  fn("greg.patch.find_by_id", "find_by_id(id) -> table or nil", "Finds a patch panel by ID."),
  fn("greg.patch.has_cable", "has_cable(id) -> bool", "Whether the panel has a cable."),
  fn("greg.patch.valid_position", "valid_position(id) -> bool", "Whether the panel position is valid."),
  fn("greg.patch.capture", "capture(id) -> table or nil", "Full panel snapshot."),
  fn("greg.patch.insert_into_rack", "insert_into_rack(id, spec) -> bool", "Inserts into rack."),

  // greg.customer
  mod("greg.customer", "Customers and bases."),
  fn("greg.customer.bases", "bases() -> table", "Array of {base_id, customer_id, money_speed, all_met, wants_internet, satisfied}."),
  fn("greg.customer.find_base", "find_base(baseId) -> table or nil", "Finds a base."),
  fn("greg.customer.is_ip_present", "is_ip_present(baseId, ip) -> bool", "Whether an IP is present."),
  fn("greg.customer.app_id_for_ip", "app_id_for_ip(baseId, ip) -> number", "App ID for an IP (-1 unknown)."),
  fn("greg.customer.register_subnet", "register_subnet(baseId, vlanId, routeKey, ips) -> bool", "Registers a subnet."),
  fn("greg.customer.unregister_subnet", "unregister_subnet(baseId, routeKey) -> bool", "Unregisters a subnet."),
  fn("greg.customer.apply_save", "apply_save(baseId, spec) -> bool", "Writes customer/difficulty/internet flags into the live base."),

  // greg.economy
  mod("greg.economy", "Economy (read-only)."),
  fn("greg.economy.sheet", "sheet() -> table or nil", "{total_salary, months}."),
  fn("greg.economy.history", "history() -> table", "Array of {month, day, salary, repair, shop}."),

  // greg.shop
  mod("greg.shop", "Computer shop."),
  fn("greg.shop.items", "items() -> table", "Array of {idx, name, price, xp, type, id, unlocked} (1-based idx)."),
  fn("greg.shop.unlock", "unlock(idx) -> bool", "Unlocks a shop item."),
  fn("greg.shop.buy", "buy(idx) -> bool", "Buys a shop item."),
  fn("greg.shop.cart", "cart() -> table", "Array of {ref, name, price, qty, total}."),
  fn("greg.shop.cart_add", "cart_add(ref) -> bool", "Adds one to a cart line."),
  fn("greg.shop.cart_remove", "cart_remove(ref) -> bool", "Removes one from a cart line."),
  fn("greg.shop.mod_items", "mod_items() -> table", "Array of {ref, name, price, mod_id}."),
  fn("greg.shop.buy_mod_item", "buy_mod_item(ref) -> bool", "Buys a mod item."),
  fn("greg.shop.picker_is_open", "picker_is_open() -> bool", "Whether the color picker is open."),
  fn("greg.shop.picker_open", "picker_open() -> bool", "Opens the color picker."),
  fn("greg.shop.picker_cancel", "picker_cancel() -> bool", "Cancels the color picker."),
  fn("greg.shop.picker_color", "picker_color() -> table or nil", "{r,g,b,a} of the picker."),
  fn("greg.shop.picker_set_color", "picker_set_color(r,g,b,a) -> bool", "Sets the picker color."),

  // greg.net
  mod("greg.net", "Network save data (read-only)."),
  fn("greg.net.routers", "routers() -> table", "Array of {asn, next_route_id, routes, owned}."),
  fn("greg.net.firewalls", "firewalls() -> table", "Array of {cluster_ip, rules}."),
  fn("greg.net.sfps", "sfps() -> table", "Array of {prefab, x, y, z, inserted}."),
  fn("greg.net.lacps", "lacps() -> table", "Array of group ids."),
  fn("greg.net.cables", "cables() -> table", "Array of {id, maxspeed}."),

  // greg.mods
  mod("greg.mods", "Mod registry and dependencies."),
  fn("greg.mods.list", "list() -> table", "Array of {id, name, version}."),
  fn("greg.mods.is_loaded", "is_loaded(modIdOrName) -> bool", "Whether a mod is loaded."),
  fn("greg.mods.version", "version(modIdOrName) -> string", "Version of a mod."),
  fn("greg.mods.declare", "declare({{mod=, min_version=, required=}, ...}) -> bool", "Declares dependencies."),
  fn("greg.mods.ensure", "ensure({mod=, min_version=?, required=?}) -> ok, detail", "Ensures one dependency."),
  fn("greg.mods.check", "check() -> table", "Array of {owner, mod, detail} problems (empty = ok)."),

  // greg.requests
  mod("greg.requests", "Service requests."),
  fn("greg.requests.list", "list() -> table", "Array of {number, state, short, long, rewarded, done, progress}."),
  fn("greg.requests.current_number", "current_number() -> number", "Current request number."),
  fn("greg.requests.add", "add(spec) -> bool", "Adds a request (spec: short, long?, state?, number?)."),

  // greg.subnet
  mod("greg.subnet", "Subnet math."),
  fn("greg.subnet.mask_from_cidr", "mask_from_cidr(cidr) -> string", "Pure math, no game needed."),
  fn("greg.subnet.usable_ips", "usable_ips(subnet) -> table", "Usable IPs (capped at 65536 entries)."),
  fn("greg.subnet.first_usable", "first_usable(subnet) -> string", "First usable IP (\"\" when none)."),

  // greg.setip
  mod("greg.setip", "Vanilla keypad UI flow."),
  fn("greg.setip.show_for", "show_for(serverId) -> bool", "Shows the keypad for a server."),
  fn("greg.setip.cancel", "cancel() -> bool", "Cancels the keypad flow."),

  // greg.modsave
  mod("greg.modsave", "Per-save mod data (travels with the savegame)."),
  fn("greg.modsave.list", "list(folder) -> table", "Array of {folder, position{x,y,z}}."),
  fn("greg.modsave.upsert", "upsert(folder, spec) -> bool", "Spec: position{x,y,z}, rotation{x,y,z}, values[], ints[], ints2[]."),
  fn("greg.modsave.remove", "remove(folder) -> bool", "Removes entries."),

  // greg.items
  mod("greg.items", "Custom item registration (meshes ship as files)."),
  fn("greg.items.register_shop_item", "register_shop_item(subfolder, spec) -> bool", "Spec: name, price, xp, size_u, mass, scale, model, texture, icon, type."),
  fn("greg.items.register_static_item", "register_static_item(subfolder, spec) -> bool", "Registers a static deco item."),

  // greg.internet
  mod("greg.internet", "Internet endpoints."),
  fn("greg.internet.endpoints", "endpoints() -> table", "Array of {server, ip, type, app, max, current}."),
  fn("greg.internet.command_center_level", "command_center_level() -> number", "Command center level."),
  fn("greg.internet.auto_repair_mode", "auto_repair_mode() -> number", "Auto repair mode."),
  fn("greg.internet.set_auto_repair_mode", "set_auto_repair_mode(mode) -> bool", "Sets auto repair mode."),

  // greg.settings
  mod("greg.settings", "Game audio settings."),
  fn("greg.settings.set_master_volume", "set_master_volume(v) -> bool", "Master volume 0..1."),
  fn("greg.settings.set_music_volume", "set_music_volume(v) -> bool", "Music volume 0..1."),
  fn("greg.settings.set_effect_volume", "set_effect_volume(v) -> bool", "Effect volume 0..1."),
  fn("greg.settings.set_racks_volume", "set_racks_volume(v) -> bool", "Rack volume 0..1."),
  fn("greg.settings.reload", "reload() -> bool", "Reloads settings."),

  // greg.objectives
  mod("greg.objectives", "Objectives and tutorials."),
  fn("greg.objectives.show", "show(index) -> bool", "Shows an objective."),
  fn("greg.objectives.stop", "stop() -> bool", "Stops objectives."),
  fn("greg.objectives.skip", "skip() -> bool", "Skips the current objective."),
  fn("greg.objectives.active", "active() -> table", "Active objective UIDs."),
  fn("greg.objectives.tutorial_in_progress", "tutorial_in_progress() -> bool", "Whether a tutorial runs."),
  fn("greg.objectives.create", "create({...}) -> bool", "Creates an objective (loc, uid, x, y, z, xp?, rep?, sub?)."),
  fn("greg.objectives.start", "start(uid, x, y, z) -> bool", "Starts an objective."),
  fn("greg.objectives.clear", "clear() -> bool", "Clears objectives."),
  fn("greg.objectives.play_video", "play_video(index, in_pause_menu) -> bool", "Plays a video."),
  fn("greg.objectives.show_in_pause", "show_in_pause(index) -> bool", "Shows video in pause menu."),
  fn("greg.objectives.stop_video_in_pause", "stop_video_in_pause() -> bool", "Stops the pause video."),

  // greg.tooltip
  mod("greg.tooltip", "Tooltips."),
  fn("greg.tooltip.overlay", "overlay(text, x, y, z, xOffset?) -> bool", "Shows a world overlay."),
  fn("greg.tooltip.hide", "hide() -> bool", "Hides the overlay."),
  fn("greg.tooltip.interact", "interact(text) -> bool", "Shows the interact prompt."),
  fn("greg.tooltip.hide_interact", "hide_interact() -> bool", "Hides the interact prompt."),

  // greg.coop
  mod("greg.coop", "Co-op helpers (game owns transport)."),
  fn("greg.coop.ensure", "ensure() -> bool", "Ensures co-op state."),
  fn("greg.coop.shutdown", "shutdown() -> bool", "Shuts co-op helpers down."),
  fn("greg.coop.peers", "peers() -> table", "Array of {id, x, y, z, yaw}."),
  fn("greg.coop.remove_avatar", "remove_avatar(peerId) -> bool", "Removes an avatar."),
  fn("greg.coop.resend", "resend() -> bool", "Resends state."),
  fn("greg.coop.peer_timeout", "peer_timeout() -> number", "Peer timeout."),

  // Misc: steam / locale / numpad / pause
  mod("greg.steam", "Steam helpers."),
  fn("greg.steam.parse_lobby", "parse_lobby(connect) -> number", "Parses a lobby connect string (0 when unparsable)."),
  mod("greg.locale", "Localization."),
  fn("greg.locale.text", "text(uid, fallback) -> string", "Localized text."),
  fn("greg.locale.change", "change(uid) -> bool", "Changes locale."),
  fn("greg.locale.current", "current() -> number", "Current locale."),
  mod("greg.numpad", "Numpad state."),
  fn("greg.numpad.is_active", "is_active() -> bool", "Whether the numpad is active."),
  fn("greg.numpad.written", "written()", "Written numpad value."),
  fn("greg.numpad.copied", "copied() -> string", "Copied numpad value."),
  fn("greg.numpad.press", "press(digit) -> bool", "Presses a digit."),
  fn("greg.numpad.press_ok", "press_ok() -> bool", "Presses OK."),
  fn("greg.numpad.press_delete", "press_delete() -> bool", "Presses delete."),
  mod("greg.pause", "Pause menu hooks."),
  fn("greg.pause.is_paused", "is_paused() -> bool", "Whether the game is paused."),
  fn("greg.pause.on_open", "on_open(fn) -> bool", "Runs fn on pause open."),
  fn("greg.pause.on_close", "on_close(fn) -> bool", "Runs fn on pause close."),

  // Tablets & widgets
  fn("greg.tablet_open", "tablet_open(title) -> id", "Opens a tablet (\"\" = failed)."),
  fn("greg.widget_open", "widget_open(title, x?, y?) -> id", "Opens a widget (\"\" = failed)."),
  fn("greg.panel_add_label", "panel_add_label(id, text) -> bool", "Adds a label."),
  fn("greg.panel_add_section", "panel_add_section(id, title) -> bool", "Adds a section."),
  fn("greg.panel_add_spacer", "panel_add_spacer(id, height?) -> bool", "Adds a spacer."),
  fn("greg.panel_add_button", "panel_add_button(id, label, fn) -> bool", "Adds a button."),
  fn("greg.panel_add_toggle", "panel_add_toggle(id, label, value, fn) -> bool", "Adds a toggle."),
  fn("greg.panel_add_slider", "panel_add_slider(id, label, min, max, value, fn) -> bool", "Adds a slider."),
  fn("greg.panel_toggle", "panel_toggle(id) -> bool", "Toggles visibility (new state)."),
  fn("greg.panel_visible", "panel_visible(id) -> bool", "Visibility state."),
  fn("greg.panel_close", "panel_close(id) -> bool", "Closes the panel."),

  // greg.world
  mod("greg.world", "World, time and meta."),
  fn("greg.world.time_of_day", "time_of_day() -> number", "Time of day."),
  fn("greg.world.day", "day() -> number", "Current day."),
  fn("greg.world.seconds_in_day", "seconds_in_day() -> number", "Seconds in a day."),
  fn("greg.world.set_seconds_in_day", "set_seconds_in_day(val)", "Sets seconds per day."),
  fn("greg.world.time_scale", "time_scale() -> number", "Time scale."),
  fn("greg.world.set_time_scale", "set_time_scale(val)", "Sets time scale."),
  fn("greg.world.pause", "pause()", "Pauses the game."),
  fn("greg.world.resume", "resume()", "Resumes the game."),
  fn("greg.world.is_paused", "is_paused() -> bool", "Whether paused."),
  fn("greg.world.scene", "scene() -> string", "Current scene."),
  fn("greg.world.difficulty", "difficulty() -> number", "Difficulty."),
  fn("greg.world.save", "save() -> bool", "Triggers a game save."),
  fn("greg.world.server_count", "server_count() -> number", "Server count."),
  fn("greg.world.rack_count", "rack_count() -> number", "Rack count."),
  fn("greg.world.switch_count", "switch_count() -> number", "Switch count."),
  fn("greg.world.open_all_walls", "open_all_walls() -> bool", "Opens all walls."),

  // greg.ui
  fn("greg.ui.notify", "notify(message, duration?)", "Shows a toast notification."),
  fn("greg.ui.log", "log(message, type?)", "Logs to DevConsole + file."),
  fn("greg.ui.log_info", "log_info(message)", "Info log line."),
  fn("greg.ui.log_warning", "log_warning(message)", "Warning log line."),
  fn("greg.ui.log_error", "log_error(message)", "Error log line."),
  fn("greg.ui.register_mod_config_tab", "register_mod_config_tab(tab_id, label, builder_fn)", "Registers a settings tab."),

  // greg.computer
  mod("greg.computer", "In-game computer shortcuts and apps."),
  fn("greg.computer.register_shortcut", "register_shortcut(id, label, target) -> bool", "Registers a main-screen shortcut."),
  fn("greg.computer.unregister_shortcut", "unregister_shortcut(id) -> bool", "Removes a shortcut."),
  fn("greg.computer.register_app", "register_app(appId, title, onOpen, onClose) -> bool", "Registers an app page."),
  fn("greg.computer.unregister_app", "unregister_app(appId) -> bool", "Removes an app."),
  fn("greg.computer.open_app", "open_app(appId) -> bool", "Opens an app."),
  fn("greg.computer.close_app", "close_app() -> bool", "Closes the app."),
  fn("greg.computer.current_app", "current_app() -> string", "Current app id."),
  fn("greg.computer.list_shortcuts", "list_shortcuts() -> table", "Lists shortcuts."),
  fn("greg.computer.list_apps", "list_apps() -> table", "Lists apps."),

  // greg.config / greg.save
  mod("greg.config", "Per-mod user settings (config.json)."),
  fn("greg.config.get", "get(key) -> string or nil", "Reads a setting."),
  fn("greg.config.get_or", "get_or(key, default) -> string", "Reads a setting with default."),
  fn("greg.config.set", "set(key, value)", "Writes a setting."),
  fn("greg.config.delete", "delete(key) -> bool", "Deletes a setting."),
  fn("greg.config.has", "has(key) -> bool", "Whether a setting exists."),
  fn("greg.config.keys", "keys() -> table", "All setting keys."),
  mod("greg.save", "Per-mod runtime state (save.json)."),
  fn("greg.save.get", "get(key) -> string or nil", "Reads state."),
  fn("greg.save.get_or", "get_or(key, default) -> string", "Reads state with default."),
  fn("greg.save.set", "set(key, value)", "Writes state (write-through)."),
  fn("greg.save.delete", "delete(key) -> bool", "Deletes state (write-through)."),
  fn("greg.save.has", "has(key) -> bool", "Whether state exists."),
  fn("greg.save.keys", "keys() -> table", "All state keys."),
  fn("greg.save.save_now", "save_now() -> bool", "Force-flushes state."),

  // greg.io
  mod("greg.io", "Sandboxed files (<modId>/data/)."),
  fn("greg.io.read_file", "read_file(path) -> string", "Reads a file (read_text is an alias)."),
  fn("greg.io.write_file", "write_file(path, content)", "Writes a file (write_text is an alias)."),
  fn("greg.io.append_file", "append_file(path, content)", "Appends to a file."),
  fn("greg.io.delete_file", "delete_file(path)", "Deletes a file."),
  fn("greg.io.file_exists", "file_exists(path) -> bool", "Whether a file exists."),
  fn("greg.io.list_files", "list_files(pattern?) -> table", "Lists files."),
  fn("greg.io.read_json", "read_json(path) -> table or nil", "Reads JSON."),
  fn("greg.io.write_json", "write_json(path, table) -> bool", "Writes JSON."),

  // greg.json
  mod("greg.json", "JSON helpers."),
  fn("greg.json.parse", "parse(text) -> table/string/number/boolean or nil", "Parses JSON."),
  fn("greg.json.stringify", "stringify(value) -> string", "Stringifies (\"\" on failure)."),

  // Events & hooks
  fn("greg.on", "on(hookName, callback)", "Subscribes to a hook or mod event.", "on(${1:hook}, function(${2:payload})\n\t$0\nend)"),
  fn("greg.once", "once(hookName, callback)", "Subscribes once.", "once(${1:hook}, function(${2:payload})\n\t$0\nend)"),
  fn("greg.fire", "fire(hookName, dataTable)", "Fires a mod-to-mod event.", "fire(${1:hook}, ${2:{}})"),
];

/** Top-level `greg.*` completions (modules + direct functions). */
export function topLevel(): LuaApiSymbol[] {
  const seen = new Set<string>();
  const out: LuaApiSymbol[] = [];
  for (const s of LUA_API) {
    const top = s.name.split(".").slice(0, 2).join(".");
    if (!seen.has(top)) {
      seen.add(top);
      const isModule = LUA_API.some(
        (o) => o !== s && o.name.startsWith(top + ".")
      );
      out.push({
        name: top,
        signature: top,
        doc: isModule ? `Module ${top} — type "${top}." for members.` : s.doc,
      });
    }
  }
  return out;
}

/** Members of `greg.<module>` for a dotted prefix like "greg.player". */
export function membersOf(prefix: string): LuaApiSymbol[] {
  const withDot = prefix.endsWith(".") ? prefix : prefix + ".";
  return LUA_API.filter(
    (s) => s.name.startsWith(withDot) && s.name !== prefix
  ).map((s) => ({
    name: s.name,
    signature: s.signature,
    doc: s.doc,
    snippet: s.snippet,
  }));
}
