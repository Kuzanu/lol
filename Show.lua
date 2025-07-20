-- // VoidUI Library v2 with Fluent Toggle \\ --
local VoidUI = {}

local Players = game:GetService("Players")
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
	local theme = settings.ThemeColor or Color3.fromRGB(80, 0, 150)

	-- ScreenGUI
	local gui = Instance.new("ScreenGui", game:GetService("CoreGui"))
	gui.Name = name .. "_UI"
	gui.ResetOnSpawn = false

	-- Main Frame
	local main = Instance.new("Frame", gui)
	main.Size = UDim2.new(0, 550, 0, 360)
	main.Position = UDim2.new(0.5, -275, 0.5, -180)
	main.BackgroundColor3 = Color3.fromRGB(18, 18, 18)
	main.BorderSizePixel = 0
	main.Name = "Main"

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

	MakeDraggable(topbar)

	-- Tabs holder
	local tabHolder = Instance.new("Frame", main)
	tabHolder.Size = UDim2.new(0, 140, 1, -40)
	tabHolder.Position = UDim2.new(0, 0, 0, 40)
	tabHolder.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
	tabHolder.BorderSizePixel = 0

	local UIList = Instance.new("UIListLayout", tabHolder)
	UIList.SortOrder = Enum.SortOrder.LayoutOrder
	UIList.Padding = UDim.new(0, 2)

	local contentHolder = Instance.new("Frame", main)
	contentHolder.Size = UDim2.new(1, -140, 1, -40)
	contentHolder.Position = UDim2.new(0, 140, 0, 40)
	contentHolder.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
	contentHolder.BorderSizePixel = 0
	contentHolder.ClipsDescendants = true

	local tabs = {}

	local function createTab(tabName)
		local tabButton = Instance.new("TextButton", tabHolder)
		tabButton.Size = UDim2.new(1, 0, 0, 36)
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
			for _, v in pairs(tabs) do
				v.Content.Visible = false
			end
			tabContent.Visible = true
		end)

		local tabObj = {
			Button = tabButton,
			Content = tabContent
		}
		table.insert(tabs, tabObj)
		if #tabs == 1 then tabContent.Visible = true end

		return tabObj
	end

	local function addToggle(tab, text, callback)
		local container = Instance.new("Frame", tab.Content)
		container.Size = UDim2.new(1, -10, 0, 32)
		container.BackgroundTransparency = 1
		container.BorderSizePixel = 0

		local label = Instance.new("TextLabel", container)
		label.Size = UDim2.new(1, -60, 1, 0)
		label.Position = UDim2.new(0, 0, 0, 0)
		label.BackgroundTransparency = 1
		label.Text = text
		label.TextColor3 = Color3.fromRGB(255, 255, 255)
		label.Font = Enum.Font.Gotham
		label.TextSize = 14
		label.TextXAlignment = Enum.TextXAlignment.Left

		local toggleBG = Instance.new("Frame", container)
		toggleBG.Size = UDim2.new(0, 50, 0, 24)
		toggleBG.Position = UDim2.new(1, -55, 0.5, -12)
		toggleBG.BackgroundColor3 = Color3.fromRGB(60, 60, 60)
		toggleBG.BorderSizePixel = 0
		toggleBG.Name = "ToggleBG"
		toggleBG.ClipsDescendants = true

		local cornerBG = Instance.new("UICorner", toggleBG)
		cornerBG.CornerRadius = UDim.new(1, 0)

		local thumb = Instance.new("Frame", toggleBG)
		thumb.Size = UDim2.new(0, 20, 0, 20)
		thumb.Position = UDim2.new(0, 2, 0.5, -10)
		thumb.BackgroundColor3 = Color3.fromRGB(220, 220, 220)
		thumb.BorderSizePixel = 0

		local cornerThumb = Instance.new("UICorner", thumb)
		cornerThumb.CornerRadius = UDim.new(1, 0)

		local toggled = false

		local function updateToggle(state)
			toggled = state
			if toggled then
				TweenService:Create(toggleBG, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(0, 170, 255)}):Play()
				TweenService:Create(thumb, TweenInfo.new(0.2), {Position = UDim2.new(1, -22, 0.5, -10)}):Play()
			else
				TweenService:Create(toggleBG, TweenInfo.new(0.2), {BackgroundColor3 = Color3.fromRGB(60, 60, 60)}):Play()
				TweenService:Create(thumb, TweenInfo.new(0.2), {Position = UDim2.new(0, 2, 0.5, -10)}):Play()
			end
			if callback then callback(toggled) end
		end

		toggleBG.InputBegan:Connect(function(input)
			if input.UserInputType == Enum.UserInputType.MouseButton1 then
				updateToggle(not toggled)
			end
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
