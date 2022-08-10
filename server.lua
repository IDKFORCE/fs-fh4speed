RegisterServerEvent("fh4speed:syncIndicators", function(vehNetId, indicatorState)
    TriggerClientEvent("fh4speed:syncIndicators", -1, vehNetId, indicatorState)
end)