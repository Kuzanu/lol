-- // VoidUI Library \\ --
local VoidUI = {}

local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

local function MakeDraggable(frame)
	local dragging, dragInput, dragStart, startPos
	frame.InputBegan:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			dragging = true
			dragStart = input.Position
			startPos = frame.Position
			input.Changed:Connect(function()
				if input.UserInputState == Enum.UserInputState.End then
					dragging = false
				end
			end)
		end
	end)
	frame.InputChanged:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseMovement then
			dragInput = input
		end
	end)
	UserInputService.InputChanged:Connect(function(input)
		if input == dragInput and dragging then
			local delta = input.Position - dragStart
			frame.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
		end
	end)
end

function VoidUI:CreateWindow(settings)
	local name = settings.Name or "VoidUI"
	local theme = settings.ThemeColor or Color3.fromRGB(60, 60, 60)

	-- ScreenGUI
	local gui = Instance.new("ScreenGui", game:GetService("CoreGui"))
	gui.Name = name .. "_UI"

	-- Main Frame
	local main = Instance.new("Frame", gui)
	main.Size = UDim2.new(0, 550, 0, 360)
	main.Position = UDim2.new(0.5, -275, 0.5, -180)
	main.BackgroundColor3 = Color3.fromRGB(18, 18, 18)
	main.BorderSizePixel = 0
	main.Name = "Main"
	main.ClipsDescendants = true

	local UICorner = Instance.new("UICorner", main)
	UICorner.CornerRadius = UDim.new(0, 8)

	-- Title Bar
	local topbar = Instance.new("Frame", main)
	topbar.Size = UDim2.new(1, 0, 0, 40)
	topbar.BackgroundColor3 = theme
	topbar.Name = "Topbar"
	topbar.BorderSizePixel = 0

	local UICornerBar = Instance.new("UICorner", topbar)
	UICornerBar.CornerRadius = UDim.new(0, 8)

	local title = Instance.new("TextLabel", topbar)
	title.Size = UDim2.new(1, 0, 1, 0)
	title.BackgroundTransparency = 1
	title.Text = name
	title.TextColor3 = Color3.fromRGB(255, 255, 255)
	title.Font = Enum.Font.GothamBold
	title.TextSize = 18
	title.Name = "Title"

	MakeDraggable(main)

	-- Tabs holder
	local tabHolder = Instance.new("Frame", main)
	tabHolder.Size = UDim2.new(0, 140, 1, -40)
	tabHolder.Position = UDim2.new(0, 0, 0, 40)
	tabHolder.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
	tabHolder.BorderSizePixel = 0

	local UIList = Instance.new("UIListLayout", tabHolder)
	UIList.SortOrder = Enum.SortOrder.LayoutOrder

	local contentHolder = Instance.new("Frame", main)
	contentHolder.Size = UDim2.new(1, -140, 1, -40)
	contentHolder.Position = UDim2.new(0, 140, 0, 40)
	contentHolder.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
	contentHolder.BorderSizePixel = 0
	contentHolder.ClipsDescendants = true

	-- Tab function
	local function createTab(tabName)
		local tabButton = Instance.new("TextButton", tabHolder)
		tabButton.Size = UDim2.new(1, 0, 0, 40)
		tabButton.Text = tabName
		tabButton.TextColor3 = Color3.fromRGB(255, 255, 255)
		tabButton.BackgroundColor3 = Color3.fromRGB(35, 35, 35)
		tabButton.Font = Enum.Font.GothamBold
		tabButton.TextSize = 14
		tabButton.BorderSizePixel = 0

		local tabContent = Instance.new("ScrollingFrame", contentHolder)
		tabContent.Name = tabName .. "_Content"
		tabContent.Size = UDim2.new(1, 0, 1, 0)
		tabContent.CanvasSize = UDim2.new(0, 0, 0, 0)
		tabContent.BackgroundTransparency = 1
		tabContent.Visible = false
		tabContent.AutomaticCanvasSize = Enum.AutomaticSize.Y
		tabContent.ScrollBarThickness = 4

		local layout = Instance.new("UIListLayout", tabContent)
		layout.SortOrder = Enum.SortOrder.LayoutOrder
		layout.Padding = UDim.new(0, 6)

		tabButton.MouseButton1Click:Connect(function()
			for _, child in pairs(contentHolder:GetChildren()) do
				if child:IsA("ScrollingFrame") then
					child.Visible = false
				end
			end
			tabContent.Visible = true
		end)

		return {
			Button = tabButton,
			Content = tabContent
		}
	end

	-- Element templates
	local function addToggle(tab, text, callback)
		local toggle = Instance.new("TextButton", tab.Content)
		toggle.Size = UDim2.new(1, -10, 0, 30)
		toggle.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
		toggle.Text = text .. " [OFF]"
		toggle.TextColor3 = Color3.fromRGB(255, 255, 255)
		toggle.Font = Enum.Font.Gotham
		toggle.TextSize = 14
		toggle.BorderSizePixel = 0

		local toggled = false
		toggle.MouseButton1Click:Connect(function()
			toggled = not toggled
			toggle.Text = text .. (toggled and " [ON]" or " [OFF]")
			if callback then callback(toggled) end
		end)
	end

	local function addButton(tab, text, callback)
		local button = Instance.new("TextButton", tab.Content)
		button.Size = UDim2.new(1, -10, 0, 30)
		button.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
		button.Text = text
		button.TextColor3 = Color3.fromRGB(255, 255, 255)
		button.Font = Enum.Font.Gotham
		button.TextSize = 14
		button.BorderSizePixel = 0

		button.MouseButton1Click:Connect(function()
			if callback then callback() end
		end)
	end

	return {
		CreateTab = createTab,
		AddToggle = addToggle,
		AddButton = addButton,
		Instance = main,
		GUI = gui
	}
end

return VoidUI
