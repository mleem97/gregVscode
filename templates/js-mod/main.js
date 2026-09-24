var open = false;
var panel = null;

function toggle() {
    open = !open;
    if (open) {
        if (!panel) panel = greg.createPanel("__MOD_NAME__");
        panel.ClearContent();
        panel.AddHeadline("Hello from JS");
        panel.AddButton("Say hi", function () { greg.toast("Hi from __MOD_ID__!", 3); });
        panel.AddSecondaryButton("Close", toggle);
        panel.Show();
    } else if (panel) {
        panel.Hide();
    }
    greg.reportMenu("__MOD_ID__", open);
}

greg.registerToggle("enabled", "Enabled", true);
greg.registerKey("toggle", "Toggle panel", toggle);
greg.bindMenu("__MOD_ID__", toggle, function () { return open; });
greg.toast("__MOD_ID__ loaded.", 3);

function onSceneLoaded(sceneName) {
    if (open) greg.reportMenu("__MOD_ID__", true);
}
