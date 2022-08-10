local isHide = false

local carRPM, carSpeed, carGear, carIL, carAcceleration, carHandbrake, carBrakeABS, carLS_r, carLS_o, carLS_h, carFuel, carIndicators, carEngineHp, carLights

RegisterCommand("hidefshud", function(_, args)	
	ToggleDisplay()
end, false)

RegisterKeyMapping('hidefshud', 'Enable or disable speedometer', 'keyboard', 'f7')

CreateThread(function()
	while true do
		Wait(50)

		playerPed = GetPlayerPed(-1)
		
		if playerPed and IsPedInAnyVehicle(playerPed) and not isHide then
			
			playerCar = GetVehiclePedIsIn(playerPed, false)
			
			if playerCar and GetPedInVehicleSeat(playerCar, -1) == playerPed then
				local NcarRPM                      = GetVehicleCurrentRpm(playerCar)
				local NcarSpeed                    = GetEntitySpeed(playerCar)
				local NcarGear                     = GetVehicleCurrentGear(playerCar)
				local NcarIL                       = GetVehicleIndicatorLights(playerCar)
				local NcarAcceleration             = IsControlPressed(0, 71)
				local NcarHandbrake                = GetVehicleHandbrake(playerCar)
				local NcarBrakeABS                 = (GetVehicleWheelSpeed(playerCar, 0) <= 0.0) and (NcarSpeed > 0.0)
				local NcarLS_r, NcarLS_o, NcarLS_h = GetVehicleLightsState(playerCar)
				local veh 						   = GetVehiclePedIsUsing(playerPed)-- need for fuel
				local fuel 						   = GetVehicleFuelLevel(veh) --fuel start
				local engineHp                     = GetVehicleEngineHealth(veh) --engine hp
				local _, lightsOne, lightsTwo = GetVehicleLightsState(veh)
				local lightsState

				--indicators start
				local indicatorsState 			   = GetVehicleIndicatorLights(veh)
				if indicatorsState == 0 then
					indicatorsState = 'off'
				elseif indicatorsState == 1 then
					indicatorsState = 'left'
				elseif indicatorsState == 2 then
					indicatorsState = 'right'
				elseif indicatorsState == 3 then
					indicatorsState = 'both'
				end
				if (lightsOne == 1 and lightsTwo == 0) then
					lightsState = 1;
				elseif (lightsOne == 1 and lightsTwo == 1) or (lightsOne == 0 and lightsTwo == 1) then
					lightsState = 2;
				else
					lightsState = 0;
				end
				
				local shouldUpdate = false
				
				if NcarRPM ~= carRPM or NcarSpeed ~= carSpeed or NcarGear ~= carGear or NcarIL ~= carIL or NcarAcceleration ~= carAcceleration 
					or NcarHandbrake ~= carHandbrake or NcarBrakeABS ~= carBrakeABS or NcarLS_r ~= carLS_r or NcarLS_o ~= carLS_o or NcarLS_h ~= carLS_h or fuel ~= carFuel or indicatorsState ~= carIndicators 
					or engineHp ~= carEngineHp or  lightsState ~= carLights then
					shouldUpdate = true
				end
				
				if shouldUpdate then
					carRPM          = NcarRPM
					carGear         = NcarGear
					carSpeed        = NcarSpeed
					carIL           = NcarIL
					carAcceleration = NcarAcceleration
					carHandbrake    = NcarHandbrake
					carBrakeABS     = NcarBrakeABS
					carLS_r         = NcarLS_r
					carLS_o         = NcarLS_o
					carLS_h         = NcarLS_h
					carFuel			= fuel
					carIndicators   = indicatorsState
					carEngineHp     = engineHp
					carLights       = lightsState

					SendNUIMessage({
						ShowHud                = true,
						CurrentCarRPM          = carRPM,
						CurrentCarGear         = carGear,
						CurrentCarSpeed        = carSpeed,
						CurrentCarKmh          = math.ceil(carSpeed * 3.6),
						CurrentCarMph          = math.ceil(carSpeed * 2.236936),
						CurrentCarIL           = carIL,
						CurrentCarAcceleration = carAcceleration,
						CurrentCarHandbrake    = carHandbrake,
						CurrentCarABS          = GetVehicleWheelBrakePressure(playerCar, 0) > 0 and not carBrakeABS,
						CurrentCarLS_r         = carLS_r,
						CurrentCarLS_o         = carLS_o,
						CurrentCarLS_h         = carLS_h,
						currentcarFuel		   = carFuel,
						currentcarIndicators   = carIndicators,
						currentcarEngineHp     = carEngineHp,
						currentcarLights 	   = carLights,
						PlayerID               = GetPlayerServerId(GetPlayerIndex())
						
					})
				else
					Wait(100)
				end

			else
				SendNUIMessage({HideHud = true})
			end
		else
			SendNUIMessage({HideHud = true})
			Wait(100)
		end
	end
end)

function ToggleDisplay()
	if isHide then
		isHide = false
	else
		SendNUIMessage({HideHud = true})
		isHide = true
	end
end


RegisterKeyMapping('leftIndicator', 'Vehicle left indicator', 'keyboard', 'LEFT')
RegisterKeyMapping('rightIndicator', 'Vehicle right indicator', 'keyboard', 'RIGHT')
RegisterKeyMapping('bothIndicators', 'Vehicle both indicators', 'keyboard', 'UP')

RegisterCommand('leftIndicator', function()
    if not IsPedInAnyVehicle(PlayerPedId()) then return end
    TriggerServerEvent('fh4speed:syncIndicators', VehToNet(GetVehiclePedIsUsing(PlayerPedId())), 1)
end)

RegisterCommand('rightIndicator', function()
    if not IsPedInAnyVehicle(PlayerPedId()) then return end
    TriggerServerEvent('fh4speed:syncIndicators', VehToNet(GetVehiclePedIsUsing(PlayerPedId())), 2)
end)

RegisterCommand('bothIndicators', function()
    if not IsPedInAnyVehicle(PlayerPedId()) then return end
    TriggerServerEvent('fh4speed:syncIndicators', VehToNet(GetVehiclePedIsUsing(PlayerPedId())), 3)
end)

RegisterNetEvent("fh4speed:syncIndicators", function(vehNetId, indicatorState)
    if not NetworkDoesEntityExistWithNetworkId(vehNetId) then return end
        local vehicle = NetToVeh(vehNetId)
        SetVehicleIndicators(vehicle, indicatorState)
end)

function SetVehicleIndicators(vehicle, indicator)
    local currentIndicator = GetVehicleIndicatorLights(vehicle)
    if currentIndicator == indicator then
        SetVehicleIndicatorLights(vehicle, 0, false)
        SetVehicleIndicatorLights(vehicle, 1, false)
        return
    end
    if vehicle and vehicle ~= 0 and vehicle ~= nil then
        local class = GetVehicleClass(vehicle)
        if class ~= 15 and class ~= 16 and class ~= 14 then
            if indicator == 1 then
                SetVehicleIndicatorLights(vehicle, 0, false)
                SetVehicleIndicatorLights(vehicle, 1, true)
            elseif indicator == 2 then
                SetVehicleIndicatorLights(vehicle, 0, true)
                SetVehicleIndicatorLights(vehicle, 1, false)
            elseif indicator == 3 then
                SetVehicleIndicatorLights(vehicle, 0, true)
                SetVehicleIndicatorLights(vehicle, 1, true)
            end
        end
    end
end

