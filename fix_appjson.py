import json
with open("frontend/app.json", "r", encoding="utf-8") as f:
    data = json.load(f)

data["expo"]["name"] = "Dom sv. Alzbety - Audio Guide"
data["expo"]["slug"] = "ke-cathedral-audio-guide"
data["expo"]["scheme"] = "ke-cathedral-audio-guide"
data["expo"]["android"]["package"] = "com.audioguide.kecathedral"
data["expo"]["android"]["backgroundColor"] = "#FDFBF7"
data["expo"]["android"]["versionCode"] = 1
data["expo"]["ios"]["bundleIdentifier"] = "com.audioguide.kecathedral"
data["expo"]["extra"]["backendUrl"] = "http://178.104.72.151:8003"
data["expo"]["extra"]["eas"]["projectId"] = ""

with open("frontend/app.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("DONE!")
