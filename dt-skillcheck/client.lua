-- [dt-skillcheck] --> discord.gg/mdstudios

local function startSkillCheck(data)
    local p = promise.new()
    
    SetNuiFocus(true, true)
    RegisterNUICallback("skillcheckResult", function(result, cb)
        SetNuiFocus(false, false)
        p:resolve(result[1])
        cb('ok')
    end)
    
    SendNUIMessage({
        interface = "skillcheck",
        action = "show",
        speed = data.speed
    })
    
    return p
end

exports("setUpSkillCheck", startSkillCheck)

-- This is how to use it. [ speed should be between 1 and 10 ]

-- RegisterCommand("testskillcheck", function()
    -- exports['dt-skillcheck']:setUpSkillCheck({ speed = 5 }):next(function(success)
    --     print(success)
    -- end)
-- end)

