content = open("frontend/constants/api.ts", "r", encoding="utf-8").read()
content = content.replace(
    "http://178.104.72.151:8003/api",
    "http://l4lcga17cpq7qo6hkc0srgzg.178.104.72.151.sslip.io/api"
)
open("frontend/constants/api.ts", "w", encoding="utf-8").write(content)
print("DONE!")
