var s_playerID;
var s_Rpm = 0.0;
var s_Speed;
var s_Gear;
var s_IL;
var s_Acceleration;
var s_Handbrake;
var s_LS_r;
var s_LS_o;
var s_LS_h;
var CalcSpeed;
var speedText = '';
var inVehicle = false;
var o_rpm;
var hasFilter = false;
var OverLoadRPM = false;
var IsOverLoad = false;
var s_fuel;
var s_indicators;
var s_enginehp;
var s_lights

$(function() {
	
    window.addEventListener("message", function(event) {
        var item = event.data;
        
        if (item.ShowHud) {
			
			inVehicle      = true;
			s_PlayerID     = item.PlayerID;
			s_Rpm          = item.CurrentCarRPM;
			s_Speed        = item.CurrentCarSpeed;
			s_Kmh          = item.CurrentCarKmh;
			s_Mph          = item.CurrentCarMph;
			s_Gear         = item.CurrentCarGear;
			s_IL           = item.CurrentCarIL;
			s_Acceleration = item.CurrentCarAcceleration;
			s_Handbrake    = item.CurrentCarHandbrake;
			s_ABS          = item.CurrentCarABS;
			s_LS_r         = item.CurrentCarLS_r;
			s_LS_o         = item.CurrentCarLS_o;
			s_LS_h         = item.CurrentCarLS_h;
			CalcSpeed      = s_Kmh;
			s_fuel		   = item.currentcarFuel;
			s_indicators   = item.currentcarIndicators;
			s_enginehp     = item.currentcarEngineHp;
			s_lights       = item.currentcarLights;
			CalcRpm        = (s_Rpm * 9);
			
			if(CalcSpeed > 999) {
				CalcSpeed = 999;
			}
			
			// Vehicle Gear display
			if(s_Gear == 0) {
				$(".geardisplay span").html("R");
				$(".geardisplay").attr("style", "color: #FFF;border-color:#FFF;");
			} else {
				$(".geardisplay span").html(s_Gear);
				if(CalcRpm > 7.5) {
					$(".geardisplay").attr("style", "color: rgb(235,30,76);border-color:rgb(235,30,76);");
				} else {
					$(".geardisplay").removeAttr("style");
				}
				if(CalcRpm >= 9) {
					IsOverLoad = true;
					if(OverLoadRPM) {
						CalcRpm = 9;
						s_Rpm = 9;
						OverLoadRPM = false;
					} else {
						var tempRandom = Math.random();
						CalcRpm = 8 + tempRandom;
						s_Rpm = 8 + tempRandom;
						OverLoadRPM = true;
					}
				} else {
					IsOverLoad = false;
				}
			}
			
			// Vehicle RPM display
			$("#rpmshow").attr("data-value", CalcRpm.toFixed(2));
			
			// Vehicle speed display
			if(CalcSpeed >= 100) {
				var tmpSpeed = Math.floor(CalcSpeed) + '';
				speedText = '<span class="int1">' + tmpSpeed.substr(0, 1) + '</span><span class="int2">' + tmpSpeed.substr(1, 1) + '</span><span class="int3">' + tmpSpeed.substr(2, 1) + '</span>';
			} else if(CalcSpeed >= 10 && CalcSpeed < 100) {
				var tmpSpeed = Math.floor(CalcSpeed) + '';
				speedText = '<span class="gray int1">0</span><span class="int2">' + tmpSpeed.substr(0, 1) + '</span><span class="int3">' + tmpSpeed.substr(1, 1) + '</span>';
			} else if(CalcSpeed > 0 && CalcSpeed < 10) {
				speedText = '<span class="gray int1">0</span><span class="gray int2">0</span><span class="int3">' + Math.floor(CalcSpeed) + '</span>';
			} else {
				speedText = '<span class="gray int1">0</span><span class="gray int2">0</span><span class="gray int3">0</span>';
			}
			
			// Handbrake
			if(s_Handbrake) {
				$(".handbrake").html("HBK");
			} else {
				$(".handbrake").html('<span class="gray">HBK</span>');
			}
			
			//fuel system
			if (s_fuel > 80.0) {
                $('.pump svg').css({'fill': `#209d05`})
                $('.pump svg').css({'filter': `drop-shadow(3px 5px 2px #209d059c)`})
            } else if (s_fuel > 60.0) {
                $('.pump svg').css({'fill': `#86e62c`})
                $('.pump svg').css({'filter': `drop-shadow(3px 5px 2px #86e62c9c)`})
            } else if (s_fuel > 40.0) {
                $('.pump svg').css({'fill': `#ebff0a`})
                $('.pump svg').css({'filter': `drop-shadow(3px 5px 2px #ebff0a9c)`})
            } else if (s_fuel > 20.0) {
                $('.pump svg').css({'fill': `#f3ce03`})
                $('.pump svg').css({'filter': `drop-shadow(3px 5px 2px #f3ce039c)`})
            } else if (s_fuel > 0.0) {
                $('.pump svg').css({'fill': `#fe0a0a`})
                $('.pump svg').css({'filter': `drop-shadow(3px 5px 2px #fe0a0a9c)`})
            }

			//indicators
			if (s_indicators) {
                if (s_indicators == 'off') {
                    $('.indicator.mxPack').removeClass('active')
                    $('#bothIndicators').show()
                    $('#leftIndicator').hide()
                    $('#rightIndicator').hide()
                } else if (s_indicators == 'left') {
                    $('.indicator.mxPack').addClass('active')
                    $('#bothIndicators').hide()
                    $('#leftIndicator').show()
                    $('#rightIndicator').hide()
                } else if (s_indicators == 'right') {
                    $('.indicator.mxPack').addClass('active')
                    $('#bothIndicators').hide()
                    $('#leftIndicator').hide()
                    $('#rightIndicator').show()
                } else if (s_indicators == 'both') {
                    $('.indicator.mxPack').addClass('active')
                    $('#bothIndicators').show()
                    $('#leftIndicator').hide()
                    $('#rightIndicator').hide()
                }
            }

			//enginehp
			if (s_enginehp > 800.0) {
                $('.engineHp svg').css({'fill': `#209d05`})
                $('.engineHp svg').css({'filter': `drop-shadow(3px 5px 2px #209d059c)`})
            } else if (s_enginehp > 600.0) {
                $('.engineHp svg').css({'fill': `#86e62c`})
                $('.engineHp svg').css({'filter': `drop-shadow(3px 5px 2px #86e62c9c)`})
            } else if (s_enginehp > 400.0) {
                $('.engineHp svg').css({'fill': `#ebff0a`})
                $('.engineHp svg').css({'filter': `drop-shadow(3px 5px 2px #ebff0a9c)`})
            } else if (s_enginehp > 200.0) {
                $('.engineHp svg').css({'fill': `#f3ce03`})
                $('.engineHp svg').css({'filter': `drop-shadow(3px 5px 2px #f3ce039c)`})
            } else if (s_enginehp > 0.0) {
                $('.engineHp svg').css({'fill': `#fe0a0a`})
                $('.engineHp svg').css({'filter': `drop-shadow(3px 5px 2px #fe0a0a9c)`})
            }

			//lights
			if (s_lights == 1) {
                $('.headlights svg').css({'fill': `#209d05`})
                $('.headlights svg').css({'filter': `drop-shadow(3px 5px 2px #209d059c)`})
            } else if (s_lights == 2) {
                $('.headlights svg').css({'fill': `#0fa4e9`})
                $('.headlights svg').css({'filter': `drop-shadow(3px 5px 2px #0fa4e99c)`})
            } else if (s_lights == 0) {
                $('.headlights svg').css({'fill': `rgba(26, 26, 26, 0.521)`})
                $('.headlights svg').css({'filter': `drop-shadow(3px 5px 2px rgba(26, 26, 26, 0.521))`})
            }

			
			// Brake ABS
			if(s_ABS) {
				$(".abs").html("ABS");
			} else {
				$(".abs").html('<span class="gray">ABS</span>');
			}
			
			// Display speed and container
			$(".speeddisplay").html(speedText);
			$("#container").fadeIn(500);
			
        } else if (item.HideHud) {
			
			// Hide GUI
			$("#container").fadeOut(500);
			inVehicle = false;
        }


    });


	
	setInterval(function() {
		if(((o_rpm != s_Rpm)) || IsOverLoad) {
			if(o_rpm - s_Rpm > 0.1 || s_Rpm - o_rpm > 0.1 || IsOverLoad) {
				if(!hasFilter) {
					if(s_Rpm > o_rpm) {
						if(s_Acceleration) {
							$("#rpmshow").css('filter', 'url(#blur3)');
						} else {
							$("#rpmshow").css('filter', 'url(#blur2)');
						}
					} else {
						if(s_Acceleration) {
							$("#rpmshow").css('filter', 'url(#blur3)');
						} else {
							$("#rpmshow").css('filter', 'url(#blur2)');
						}
					}
					// $("#rpmshow").css('filter', 'url(#blur2)');
					hasFilter = true;
				}
			} else {
				if(hasFilter) {
					$("#rpmshow").css('filter', 'drop-shadow(0px 0px 4px rgba(0,0,0,0.1))');
					hasFilter = false;
				}
			}
			o_rpm = s_Rpm;
		} else {
			if(hasFilter) {
				$("#rpmshow").css('filter', 'drop-shadow(0px 0px 4px rgba(0,0,0,0.1))');
				hasFilter = false;
			}
		}
	}, 100);
});






